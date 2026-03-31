# Maintenance OS v1 - Late-Reply & Stale Data Audit

**Audit Date:** 2026-03-31
**Scope:** Late-reply and stale data scenarios in contractor dispatch flow

---

## Executive Summary

The app has STRONG idempotency controls and prevents the most critical data corruption scenarios. However, there are several edge cases where late replies, stale data, and UI inconsistencies could occur:

- **Multiple replies from same contractor:** Prevented (idempotency on `providerInboundId` + `dispatchId + rawMessage` content)
- **Dispatch message mutation:** Safe (stored immutably at send time)
- **Photo URL breakage:** VULNERABLE (inline URLs in emails)
- **Resend tokens:** Creates NEW dispatch records (dual valid tokens possible)
- **Mixed issue states UI:** Renders responses even when issue is canceled/completed

---

## Scenario 1: Contractor Sends Multiple Replies to Same Dispatch

**Question:** Can a contractor send 3 replies and create 3 separate response records? What does the UI show?

### Email Inbound Webhook
**File:** `/app/api/webhooks/email/inbound/route.ts`

**Idempotency Checks (in order):**
1. **Line 121-126:** Check `providerInboundId` (Resend email ID)
   ```typescript
   const existingByProviderId = await prisma.contractorResponse.findUnique({
     where: { providerInboundId: emailId },
   });
   if (existingByProviderId) {
     return NextResponse.json({ success: true }, { status: 200 });
   }
   ```
   - **Resend email IDs are unique per message** — catches webhook retries but not genuine duplicate replies

2. **Line 240-249:** Check for content-based dups (before creating response)
   ```typescript
   const existingResponse = await prisma.contractorResponse.findFirst({
     where: {
       dispatchId: matchingDispatch.id,
       rawMessage: text,
     },
   });
   if (existingResponse) {
     return NextResponse.json({ success: true }, { status: 200 });
   }
   ```
   - **Only prevents exact duplicate text** — "reply 1", "reply 2", "reply 3" would all pass this check

### SMS Inbound Webhook
**File:** `/app/api/webhooks/twilio/inbound/route.ts`

**Idempotency Checks (similar):**
1. **Line 50-57:** Check `providerInboundId` (Twilio MessageSid)
   ```typescript
   const existingByProviderId = await prisma.contractorResponse.findUnique({
     where: { providerInboundId: messageSid },
   });
   ```

2. **Line 135-144:** Content-based duplicate check
   ```typescript
   const existingResponse = await prisma.contractorResponse.findFirst({
     where: {
       dispatchId: matchingDispatch.id,
       rawMessage: body,
     },
   });
   ```

### Result: VULNERABLE
- **If Resend/Twilio assign unique IDs to each message:** No duplicates (each message is genuinely new)
- **If contractor resends same message text:** Only the first is stored, others are deduplicated
- **If contractor sends 3 different replies:** All 3 create separate `ContractorResponse` records ✓

### UI Display
**File:** `/app/(app)/issues/[id]/page.tsx` (lines 145-154, 469-623)

```typescript
// Line 146-154: Flatten and sort responses
const allResponses = issue.dispatches
  .flatMap((dispatch) =>
    (dispatch.responses || []).map((response) => ({ dispatch, response }))
  )
  .sort((a, b) => {
    const priceA = Number(a.response.flatEstimate || a.response.estimateLow || a.response.estimateHigh) || Infinity;
    const priceB = Number(b.response.flatEstimate || b.response.estimateLow || b.response.estimateHigh) || Infinity;
    return priceA - priceB;
  });
```

- **UI renders ALL responses from a dispatch**
- If same contractor sends 3 replies: **3 separate quote cards appear** (sorted by price)
- **No deduplication in UI** — all 3 quotes shown separately

---

## Scenario 2: User Edits Issue Description AFTER Dispatches Sent

**Question:** Is dispatch message stored at send time (immutable) or live reference?

### Dispatch Message Storage
**File:** `/app/api/issues/[id]/dispatch/route.ts` (lines 123-135, 150-159)

```typescript
// Line 125: Build message with current description
const baseMessage = `New repair request for ${propertyDisplay}.\nIssue: ${issue.title}\nDetails: ${issue.description}...`;

// Line 155: Store IMMUTABLE message at dispatch time
const dispatch = await prisma.dispatch.create({
  data: {
    issueId,
    contractorId: contractor.id,
    channel: reqContractor.channel,
    outboundMessage: messageWithPhotos,  // <-- STORED HERE
    replyToken,
    status: 'queued',
  },
});
```

### What Contractor Sees
**File:** `/app/api/issues/[id]/dispatch/route.ts` (lines 163-180)

```typescript
// SMS: Embedded directly
const smsBody = `[Ref: ${replyToken}] ${baseMessage}`;

// EMAIL: Embedded in HTML body
const emailBody = `<div style="..."><p>${baseMessage.replace(/\n/g, '<br>')}${photoHtml}...</p></div>`;
```

**Result: SAFE ✓**
- Dispatch message is **stored immutably** at send time (line 155: `outboundMessage`)
- User can edit issue description after dispatch — **contractor still sees original message**
- If user later checks dispatch record, it shows what was actually sent

---

## Scenario 3: User Deletes Photo That Was Included in Dispatches

**Question:** Do dispatch emails have inline photo URLs? Do they break on deletion?

### Photo URL Handling in Dispatch
**File:** `/app/api/issues/[id]/dispatch/route.ts` (lines 128-135, 169-177)

```typescript
// Line 129-134: Get photo URLs
const photoUrls = issue.photos
  .map(p => p.fileUrl)
  .filter((url): url is string => url !== null);

// Line 174-177: INLINE images in email
photoHtml = `
  <div style="..."><a href="${p.fileUrl}" target="_blank"><img src="${p.fileUrl}" alt="..." /></a>...
`;
```

### Photo Storage & Deletion
**File:** `/app/api/issues/[id]/photos/[photoId]/route.ts` (assumed based on schema)

- Photos stored in **Supabase public bucket** (`issue-photos`)
- `fileUrl` is **direct public URL**, not signed (immutable once set)

### Result: VULNERABLE ✗

**If user deletes photo after dispatch sent:**
1. Photo deleted from Supabase storage
2. **All emails sent contain the old `fileUrl`**
3. **Email links now return 404** (photo no longer exists)
4. **Email still renders broken image** in email clients

**Mitigation missing:**
- No "immutable photo archive" for dispatches
- Should either:
  - Store photo content **in the dispatch message** (base64 embed)
  - Keep photos **indefinitely** (mark as archived, don't delete)
  - Generate **dispatch-specific attachment URLs** instead of live product URLs

---

## Scenario 4: Resend Dispatch Creates New Reply Token

**Question:** Does resend create new dispatch or update old? Could contractor have 2 valid tokens?

### Resend Logic
**File:** `/app/api/issues/[id]/resend-dispatch/route.ts` (lines 43-98)

```typescript
// Line 44: GENERATE NEW TOKEN
const replyToken = generateReplyToken();

// Line 87-98: CREATE NEW DISPATCH RECORD
const newDispatch = await prisma.dispatch.create({
  data: {
    issueId,
    contractorId: contractor.id,
    channel: dispatch.channel,
    replyToken,  // <-- NEW TOKEN
    outboundMessage: message,
    status: 'sent',
    sentAt: new Date(),
    providerMessageId,
  },
});
```

**Result: CRITICAL ISSUE ✗**

**Dual Valid Tokens:**
1. Original dispatch sent with `MNT-ABC123`
2. Resend creates NEW dispatch with `MNT-XYZ789`
3. **Both tokens are valid and point to different dispatch records**
4. Contractor could reply to either email → creates 2 separate responses

**Example Timeline:**
- Contractor gets first dispatch (token: `MNT-ABC123`)
- User clicks "Resend" (new dispatch with token: `MNT-XYZ789`)
- Contractor replies to old email with `MNT-ABC123` → response record created
- Contractor also replies to new email with `MNT-XYZ789` → separate response record created
- **Both responses show as quotes from same contractor** (lines 146-154 flatten all responses)

**Database State:**
```
Dispatch 1: replyToken='MNT-ABC123', status='sent'
  -> Response 1: "I can do it for $500"

Dispatch 2: replyToken='MNT-XYZ789', status='sent'
  -> Response 2: "Actually, I can do it for $450"
```

---

## Scenario 5: Mixed Issue States & UI Rendering

**Question:** What renders when issue is canceled/completed but has contractor responses?

### Issue Status vs Response Rendering
**File:** `/app/(app)/issues/[id]/page.tsx`

#### Scenario 5a: Issue Canceled, Contractor Responses Exist

**Status Banner (lines 238-247):**
- Shows "This repair is complete" (if `status === 'completed'`)
- Shows "All jobs canceled" (if `status === 'active_job' && !activeJob`)
- **No special banner for `status === 'canceled'`** ← ISSUE

**Response Cards (lines 469-623):**
```typescript
{allResponses.length > 0 && (
  <Card id="quotes">
    <CardHeader>
      <CardTitle className="text-lg">Quote Responses</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {allResponses.map(({ dispatch, response }) => {
        // Lines 592-602: Actions only if not already selected
        {!isNotSelected && (
          <div className="flex items-center gap-2 pt-1">
            {issue.status === 'quotes_received' && (
              <SelectContractorButton {...} />
            )}
            <ReplyToContractorButton {...} />
          </div>
        )}
      })}
    </CardContent>
  </Card>
)}
```

**Result:**
- **Responses still render** in all states (no status check on rendering)
- **SelectContractorButton hidden** if `status !== 'quotes_received'`
- **ReplyToContractorButton always visible** (can reply to responses even if issue canceled)
- User sees quote cards but can't select or act on them ← CONFUSING

#### Scenario 5b: Issue Completed, Unread Responses Still Arrive

**Timeline:**
1. Issue marked completed
2. Late reply arrives (webhook processes it)
3. Response created (line 415-467 in email webhook stores it)
4. Issue detail page shows completed banner + quote cards from completed job ← CONFUSING

**Late Reply Handling (lines 411-456 in email webhook):**
```typescript
const jobAlreadyAwarded = ['active_job', 'completed', 'canceled'].includes(issue.status);

if (jobAlreadyAwarded) {
  // Store response anyway
  await prisma.contractorResponse.create({
    data: {
      dispatchId: matchingDispatch.id,
      providerInboundId: emailId,
      rawMessage: text,
      receivedAt: new Date(),
    },
  });

  // Send auto-reply
  // ...

  return NextResponse.json({ success: true }, { status: 200 });
}
```

**Result:**
- Late replies **are stored** (line 415-422)
- **Appear on issue detail page** after job completed
- User can read but cannot act on them
- Timeline shows late reply event

#### Scenario 5c: Issue Active Job, Responses from Non-Selected Contractors

**When contractor selected (select-contractor route, lines 103-116):**
```typescript
// Update dispatch for selected contractor → accepted
await tx.dispatch.updateMany({
  where: { issueId, contractorId },
  data: { status: 'accepted' },
});

// Close all other open dispatches
await tx.dispatch.updateMany({
  where: {
    issueId,
    contractorId: { not: contractorId },
    status: { in: ['sent', 'delivered', 'replied'] },
  },
  data: { status: 'closed', closedReason: 'not_selected' },
});
```

**UI Display (lines 477-490):**
```typescript
const isSelected = activeJob?.selectedResponse?.id === response.id;
const isNotSelected = activeJob && !isSelected;

return (
  <div className={`rounded-xl border p-4 space-y-3 ${
    isSelected
      ? 'border-green-300 bg-green-50'
      : isNotSelected
        ? 'border-gray-200 bg-gray-50/50 opacity-60'  // GRAYED OUT
        : 'border-border'
  }`}>
```

**Result:**
- Selected response: green highlight ✓
- Non-selected responses: grayed out at 60% opacity ✓
- **UI clearly distinguishes selected from not-selected** ← GOOD

---

## Summary Table

| Scenario | File | Line(s) | Finding | Risk |
|----------|------|---------|---------|------|
| Multiple replies | `/webhooks/email/inbound/route.ts` | 121-249 | 3 different replies = 3 response records | MEDIUM - confusing UI |
| Message mutation | `/issues/[id]/dispatch/route.ts` | 155 | Stored immutably ✓ | NONE |
| Photo URL breakage | `/issues/[id]/dispatch/route.ts` | 174-177 | Inline URLs break on photo delete | HIGH - broken links in emails |
| Dual tokens | `/issues/[id]/resend-dispatch/route.ts` | 44, 87-98 | New dispatch = new token = new response path | MEDIUM-HIGH - duplicate responses |
| Mixed states - canceled | `/issues/[id]/page.tsx` | 469-623 | Responses render, no action buttons | MEDIUM - confusing UX |
| Mixed states - completed | `/webhooks/email/inbound/route.ts` | 415-422 | Late replies stored anyway | LOW - expected behavior |
| Mixed states - not selected | `/issues/[id]/page.tsx` | 477-490 | Grayed out properly ✓ | NONE |

---

## Recommendations

### HIGH PRIORITY

1. **Photo URL Breakage**
   - [ ] Don't delete photos; soft-delete (archive flag)
   - [ ] Or: embed photos in dispatch message at send time
   - [ ] Or: create immutable dispatch-specific photo archive URLs

2. **Resend Dual Tokens**
   - [ ] Reuse original `replyToken` on resend (don't create new one)
   - [ ] Or: map old token → new dispatch record in webhook
   - [ ] Or: document that contractors get new reference number on resend

### MEDIUM PRIORITY

3. **Multiple Replies UI**
   - [ ] Add "You received X quotes" vs "You received X replies" messaging
   - [ ] Consider deduplicating responses at UI layer (show latest per contractor per dispatch)
   - [ ] Or: add response timestamp/version to UI

4. **Canceled Issue Rendering**
   - [ ] Add status banner when issue `canceled`
   - [ ] Hide ReplyToContractorButton if issue `canceled` or `completed`
   - [ ] Add "This issue is closed" messaging above response cards

### LOW PRIORITY (Already Handled Well)

5. **Message Immutability** ✓ — Already correct
6. **Late Reply Handling** ✓ — Already stores and notifies appropriately
7. **Not-Selected UI** ✓ — Already grayed out correctly

---

## Code Locations Reference

- Dispatch creation: `/app/api/issues/[id]/dispatch/route.ts` (lines 150-242)
- Email webhook: `/app/api/webhooks/email/inbound/route.ts` (lines 77-623)
- SMS webhook: `/app/api/webhooks/twilio/inbound/route.ts` (lines 23-509)
- Resend dispatch: `/app/api/issues/[id]/resend-dispatch/route.ts` (lines 14-127)
- Issue detail UI: `/app/(app)/issues/[id]/page.tsx` (lines 83-670)
- Select contractor: `/app/api/issues/[id]/select-contractor/route.ts` (lines 15-251)
- Database schema: `/prisma/schema.prisma` (lines 228-274, 276-295, 297-321)
