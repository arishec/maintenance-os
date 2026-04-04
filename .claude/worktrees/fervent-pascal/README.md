# Maintenance OS V1 Starter

This is a serious starter codebase for the Maintenance OS product we scoped.

## Locked stack
- Next.js App Router
- TypeScript
- Tailwind
- shadcn-style primitives
- Clerk auth
- Supabase Postgres + Storage
- Prisma ORM
- Anthropic Claude
- Twilio SMS
- Resend email
- Vercel hosting

## Included now
- project scaffold
- Prisma schema for the core data model
- core dashboard / issues / contractors / properties UI
- Clerk-aware local user bootstrap helper
- issue classification service using Claude
- contractor reply parse service using Claude
- property, contractor, and issue API routes
- environment variable template

## Still to wire in your live environment
- Clerk project keys
- Supabase database and storage bucket
- Prisma migrations against your real database
- Twilio webhook routes
- Resend outbound + inbound email implementation
- authenticated forms connected to live route handlers
- file uploads to Supabase Storage
- response comparison UI backed by real dispatch records

## Recommended first commands
```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

## Suggested build order from here
1. finish authenticated CRUD forms for properties and contractors
2. connect report-issue form to `POST /api/issues`
3. add dispatch creation endpoint and Twilio send flow
4. add inbound SMS webhook and contractor response persistence
5. add Resend outbound/inbound email support
6. build quote comparison table using live dispatch + response data
7. add tenant intake token flow
8. add per-issue cost tracking updates in dispatch and inbound handlers

## Important product rules
- do not turn this into a marketplace in V1
- do not require contractor accounts in V1
- always store raw contractor replies
- keep AI assistive and reviewable
- track messaging usage from day one
