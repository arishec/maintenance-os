# MAINTENANCE OS - COMPREHENSIVE UX/LOGIC AUDIT REPORT
Generated: 2026-04-04

---

## SUMMARY

This audit examined all key user-facing flows and data integrity logic. **12 significant UX/logic issues** were identified, ranging from confusing user messaging to potential data integrity concerns. The app is functionally complete but has several places where the user experience doesn't match expectations or where edge cases are not handled gracefully.

---

## CRITICAL FINDINGS (Must Fix)

### 1. CANCELED ISSUES DON'T APPEAR IN "ALL" VIEW BY DEFAULT

**File & Location:**
- `/app/(app)/issues/page.tsx` (line 74)
- `/lib/status.ts` (line 74)

**The Problem:**
The "All" view tab shows issues with statuses: `new`, `classified`, `awaiting_dispatch`, `awaiting_quotes`, `quotes_received`, `active_job`, **and** `completed`. BUT IT DOES NOT INCLUDE `canceled` OR `archived` status.

This means:
- A user cancels an issue (status = `canceled`)
- They go to the Issues list
- The canceled issue is NOT shown anywhere unless they click the "Canceled" tab
- **This is confusing because the user doesn't see feedback for their cancellation action**

**Why It's a Problem:**
1. **No visual feedback** - User clicks "Close Issue" → Cancel, and the issue seems to vanish without trace
2. **Hidden state** - The issue didn't disappear; it's in the "Canceled" view, but users won't know this
3. **Inconsistent with completed** - Completed issues show in "All", but canceled issues don't

**Expected Behavior:**
Either:
- Option A: Include `canceled` in "All" view alongside `completed` (most logical)
- Option B: Show a dismissal toast/confirmation that redirects to the Canceled tab
- Option C: Make the default "active" view only (not "all") to prevent confusion

**Suggested Fix:**
Update `VIEW_STATUS_MAP['all']` in `/lib/status.ts` line 74 to include `'canceled'`:
```javascript
all: [...OPEN_ISSUE_STATUSES, 'completed', 'canceled'],
```

---

### 2. CONTRACTOR WITHOUT EMAIL AND PHONE CAN STILL BE SELECTED (DATA INTEGRITY BUG)

**File & Location:**
- `/app/api/issues/[id]/select-contractor/route.ts` (lines 177-207)

**The Problem:**
When a contractor is selected for a job, the code attempts to notify them via email or SMS:
```javascript
if (dispatch.channel === 'sms' && contractor.phone) {
  const smsResult = await sendRepairRequestSms(contractor.phone, confirmationMsg);
} else if (contractor.email) {
  // send email
} else {
  console.warn('[SELECT] No contact method for contractor...');
}
```

**The issue:** If a contractor has NO phone and NO email, the notification just silently fails with a console warning. The job is still selected, the contractor is still assigned, but they will NEVER know they were selected because there's no way to contact them.

This is a **contractor creation bug** that should have been caught there, but the workaround check here is insufficient.

**Why It's a Problem:**
1. Contractor doesn't know they have a job
2. User thinks contractor knows (no error shown)
3. Contractor never shows up or responds
4. User is left waiting for a contractor who was never actually notified

**Related Issue:**
The `POST /api/contractors` route validates that contractors have EITHER email OR phone (line 84 of `/app/api/contractors/route.ts`), but the PATCH route (update) does NOT enforce this validation. A contractor could be created valid, then updated to remove both contact methods.

**Suggested Fix:**

1. **Short term:** Add validation in select-contractor endpoint - reject selection if contractor has no email AND no phone:
```javascript
if (!contractor.phone && !contractor.email) {
  return NextResponse.json(
    { error: `${contractor.name} has no email or phone number. Add contact info before selecting them.` },
    { status: 400 }
  );
}
```

2. **Longer term:** Add the same "either email or phone" validation to the PATCH `/api/contractors/[id]` route that exists in the POST route.

---

### 3. CLOSING AN ISSUE DURING ACTIVE_JOB BYPASSES CONTRACTOR NOTIFICATION

**File & Location:**
- `/app/(app)/issues/[id]/close-issue-button.tsx` (line 26)
- `/lib/status.ts` (line 51)
- `/app/api/issues/[id]/close/route.ts` (line 36)

**The Problem:**
The `CloseIssueButton` shows a "Close Issue" button on all statuses EXCEPT `completed`, `canceled`, and `archived`. This means the button shows when status = `active_job`.

When an issue is in `active_job` status and you click "Close Issue", you're setting it to either `completed` (self-resolved) or `canceled`. This BYPASSES the job cancellation logic in `/app/api/jobs/[id]/route.ts`.

That endpoint has complex logic for:
- Notifying the contractor
- Reverting the issue to appropriate status for re-dispatch
- Closing/reopening dispatches

But `CloseIssueButton` → `POST /api/issues/[id]/close` doesn't call any of that. It just updates the issue status directly.

**Why It's a Problem:**
1. **Contractor not notified** - If you close while active_job, contractor never gets told the job is canceled
2. **Inconsistent UX** - Job cancellation from the job lifecycle panel behaves differently than issue close button
3. **Data inconsistency** - The issue is canceled/closed but the job record still says "selected" or "scheduled"

**Test Case:**
1. Create issue, send to contractors, select one → status = `active_job`, job.status = `selected`
2. Click "Close Issue" button → "Cancel" without self-resolved
3. Issue status becomes `canceled`, but job.status is still `selected`
4. Contractor was never notified
5. Going back to the job shows it's in `selected` state even though the issue is canceled

**Suggested Fix:**
Modify `/app/api/issues/[id]/close/route.ts` to detect `active_job` status and reject the request:
```javascript
if (issue.status === 'active_job') {
  return NextResponse.json(
    { error: 'Cancel the active job first using the job control panel, then the issue will close.' },
    { status: 400 }
  );
}
```

---

## HIGH-PRIORITY FINDINGS (Should Fix Soon)

### 4. ARCHIVED TAB HIDDEN IF NO DATA EXISTS

**File & Location:**
- `/app/(app)/issues/page.tsx` (lines 179-187)

**The Problem:**
The issue list has tabs for "All", "Open", "Awaiting Quotes", "Quotes Received", "Active Jobs", "Completed", and "Canceled". BUT "Archived" tab only appears if there's at least one archived issue.

Logic:
```javascript
const alwaysShowViews = new Set(['all', 'open']);
const viewsWithIssues = Object.entries(VIEW_STATUS_MAP).filter(([key, statuses]) => {
  if (alwaysShowViews.has(key)) return true;
  if (key === currentView) return true;
  if (!statuses) return true;
  return statuses.some((s) => (statusCountMap.get(s) ?? 0) > 0);
}).map(([key]) => key);
```

**Why It's a Problem:**
1. **Discoverability issue** - Users with no archived issues can't see the Archived tab, so they don't know archiving is possible
2. **Feature invisibility** - A whole status exists but is hidden until you have data in it
3. **Inconsistent with Canceled** - Canceled tab shows even if there are no canceled issues

**Suggested Fix:**
Add "archived" (and "canceled") to the `alwaysShowViews` set:
```javascript
const alwaysShowViews = new Set(['all', 'open', 'canceled', 'archived']);
```

---

### 5. "ACTIVE JOB" STATUS TERMINOLOGY CONFUSING IN LIST

**File & Location:**
- `/app/(app)/issues/page.tsx` (lines 374-376)
- `/lib/status.ts` (line 16)

**The Problem:**
When status = `active_job`, the issue list shows:
```javascript
if (issue.status === 'active_job' && activeJob) {
  derivedStatus = JOB_STATUS_LABELS[activeJob.status] || 'Active Job';
}
```

This means a user sees "Contractor Selected", "Scheduled", or "In Progress" in the issues list, but **these are job statuses, not issue statuses**. The issue status is `active_job`, but the display shows job-level granularity.

The "Active Jobs" tab claims to show active jobs, but it actually includes selected/scheduled jobs that haven't started yet.

**Why It's a Problem:**
1. **Semantic overload** - "Active Job" could mean "in progress" but actually includes "selected" and "scheduled"
2. **Inconsistent terminology** - List shows job status, detail page shows issue status
3. **Tab misleading** - "Active Jobs" tab shows issues with jobs that haven't started work yet

**Suggested Fix:**
Clarify the tab label to indicate it includes all job stages:
```javascript
// Option A: Rename tab
'active_jobs': 'Jobs in Progress & Scheduled',

// Option B: Simpler
'active_jobs': 'Jobs',
```

---

### 6. PROPERTY DELETION UI BUTTON MISSING (API EXISTS)

**File & Location:**
- `/app/(app)/properties/[id]/page.tsx` (edit button present, no delete button)
- `/app/api/properties/[id]/route.ts` (DELETE endpoint exists, lines 214-219)

**The Problem:**
The property detail page has an edit button but NO delete button, even though the API supports property deletion with proper guards (won't delete if property has active issues).

**Why It's a Problem:**
1. Users can't clean up old/unused properties through the UI
2. The feature exists in code but is hidden
3. Users with archived properties are stuck with them in the list

**Suggested Fix:**
Add a delete button to the property detail page:
```javascript
<Button
  variant="destructive"
  onClick={() => handleDelete()}
  disabled={hasActiveIssues}
>
  Delete Property
</Button>
```

---

### 7. ISSUE TITLE CAN BE NULL (AI CLASSIFICATION SILENT FAILURE)

**File & Location:**
- `/app/api/issues/route.ts` (line 11-16)

**The Problem:**
When creating an issue, the schema only requires `description`. The `title` field is populated by AI classification:
```javascript
const issueSchema = z.object({
  propertyId: z.string().uuid(),
  description: z.string().min(2, '...').max(5000, '...'),
  locationInProperty: z.string().optional(),
  signals: z.array(z.string()).optional(),
});
```

If AI classification fails (API key missing, API down, etc.), the issue is created with `title: NULL`.

Then the issues list shows:
```javascript
{issue.title || 'Untitled Issue'}
```

**Why It's a Problem:**
1. **Silent failure** - AI classification fails, but issue is created anyway
2. **Confusing UX** - "Untitled Issue" looks like a bug
3. **Data quality** - Issues with NULL titles in the database

**Suggested Fix:**

Option A: If AI fails, use the first 50 chars of description as title:
```javascript
if (!classifiedIssue.title) {
  classifiedIssue.title = body.description.substring(0, 50) + '...';
}
```

Option B: Require user to provide title if classification fails.

---

### 8. DISPATCH CHANNEL NOT VALIDATED AGAINST CONTRACTOR CONTACT INFO

**File & Location:**
- `/app/(app)/issues/[id]/dispatch/page.tsx` (dispatch form)
- `/app/api/issues/[id]/dispatch/route.ts` (line 177)

**The Problem:**
When dispatching to contractors, the form doesn't validate that the contractor has an email or phone number for the selected channel.

```javascript
// No validation that:
if (channel === 'email' && !contractor.email) {
  // reject
}
if (channel === 'sms' && !contractor.phone) {
  // reject
}
```

Then when sending, the code silently falls back:
```javascript
if (dispatch.channel === 'sms' && contractor.phone) {
  // send SMS
} else if (contractor.email) {
  // fallback to email (user doesn't know!)
}
```

**Why It's a Problem:**
1. **Silent failure** - No error shown, user unaware of fallback
2. **Contractor confusion** - Gets email when they expected SMS
3. **Compliance risk** - If you said SMS was sent, but email was sent, that's misleading

**Suggested Fix:**

Add validation in dispatch form to disable/reject unavailable channels:
```javascript
const availableChannels = [
  contractor.email && 'email',
  contractor.phone && 'sms',
].filter(Boolean);

if (availableChannels.length === 0) {
  // Show error: "This contractor has no email or phone number"
  return;
}

// Disable unavailable options in the UI
const isSmsDisabled = !contractor.phone;
const isEmailDisabled = !contractor.email;
```

---

## MEDIUM-PRIORITY FINDINGS (Nice to Have)

### 9. HISTORY PAGE MIXES COMPLETED AND CANCELED ISSUES

**File & Location:**
- `/app/(app)/history/page.tsx` (line 34)

**The Problem:**
The history page shows both completed and canceled issues together:
```javascript
const completedIssues = await prisma.issue.findMany({
  where: { propertyId: { in: propertyIds }, status: { in: ['completed', 'canceled'] } },
```

**Why It's a Problem:**
1. Semantically, "History" suggests completed work, not canceled work
2. Users looking for finished jobs see canceled jobs mixed in

**Suggested Fix:**

Most minimal change - improve the copy:
```javascript
<p className="text-muted-foreground text-sm mt-1">Finished repairs and canceled jobs</p>
```

More comprehensive - split into sections on the same page.

---

### 10. NO PROPERTY LINKS SHOWN IN CONTRACTOR LIST

**File & Location:**
- `/app/(app)/contractors/page.tsx` (contractors list)
- `/app/(app)/properties/[id]/page.tsx` (shows property-linked contractors)

**The Problem:**
You can see which contractors are linked to a property when viewing the property, but when looking at the contractors list, there's no indication of which properties they're linked to.

If you have 20 contractors and want to know "which contractors are set up for the beach house", you have to:
1. Go to Properties
2. Click on "Beach House"
3. Scroll down to see linked contractors

**Suggested Fix:**
Add a small badge to contractor cards showing linked properties:
```javascript
<div className="mt-2 text-xs text-muted-foreground">
  Linked to: Beach House, Downtown Condo
</div>
```

---

## EDGE CASES & DATA INTEGRITY CONCERNS

### 11. SILENT FAILURE WHEN ACCESSING DELETED ISSUE/PROPERTY

**File & Location:**
- `/app/(app)/issues/[id]/page.tsx` (line 134)

**The Problem:**
When viewing an issue, the code checks:
```javascript
if (!issue || issue.property.ownerUserId !== user.id) {
  redirect('/issues');
}
```

If the property has been deleted (cascade delete), this just redirects without explanation.

**Suggested Fix:**
Add a catch-all error state instead of silent redirect:
```javascript
if (!issue) {
  return (
    <LayoutShell>
      <Card>
        <CardContent className="py-8">
          <p className="text-muted-foreground">Issue not found. It may have been deleted.</p>
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
```

---

## SCHEMA & MODELING NOTES

### 12. ISSUE STATUS LIFECYCLE DOCUMENTATION MISSING

**File & Location:**
- `/lib/status.ts` (lines 44-55)

**Observation:**
The valid transitions define some non-obvious paths:
```javascript
new: ['classified', 'quotes_received', 'canceled', 'completed'],
```

You can jump directly from `new` → `quotes_received`, bypassing dispatch (probably intentional for manual quote entry), but this isn't obvious.

Also, both `completed` and `canceled` can transition to `archived`, making `archived` ambiguous (is it historical work or dismissed work?).

**Suggested Fix:**
Add explanatory comments:
```javascript
completed: ['archived'],  // Mark issue as historical
canceled: ['archived'],   // Dismiss canceled jobs
```

---

## SUMMARY TABLE

| ID | Severity | Category | Issue | Fix Effort |
|----|----------|----------|-------|-----------|
| 1 | CRITICAL | UX | Canceled issues don't show in "All" view | 5 min |
| 2 | CRITICAL | Data Integrity | Contractor without contact info can be selected | 30 min |
| 3 | CRITICAL | Logic Bug | Close button doesn't notify contractor | 1 hour |
| 4 | HIGH | UX | Archived tab hidden if no data | 5 min |
| 5 | HIGH | UX | "Active Job" status terminology confusing | 15 min |
| 6 | HIGH | Feature | Property delete button missing from UI | 30 min |
| 7 | HIGH | Data Quality | Issue title can be NULL | 30 min |
| 8 | HIGH | Validation | Dispatch channel not validated against contractor | 45 min |
| 9 | MEDIUM | UX | History page mixes completed and canceled | 20 min |
| 10 | MEDIUM | UX | No property links shown in contractor list | 1 hour |
| 11 | LOW | Error Handling | Silent failure when accessing deleted issue | 15 min |
| 12 | LOW | Documentation | Archived status semantics unclear | 10 min |

---

## TESTING CHECKLIST

- [ ] Cancel an issue and verify it appears in the Canceled tab AND in "All" view
- [ ] Try to select a contractor with no email and no phone → verify error
- [ ] Close an issue while status=active_job and verify contractor is notified
- [ ] Create 0 issues, verify Archived tab is visible
- [ ] Dispatch selecting SMS to contractor with only email → verify error shown
- [ ] Create an issue, simulate AI classification timeout, verify issue has usable title
- [ ] Delete a property with no active issues → verify success
- [ ] Archive a completed issue, verify it doesn't count in "Completed this month"

