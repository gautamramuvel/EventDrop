# EventDrop

24-hour neighborhood event board built with Next.js, Clerk, Supabase PostGIS, Supabase Cron, and Resend.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill Clerk, Supabase, Resend, and internal job secret values.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

## Supabase Setup

Run `supabase/migrations/0001_init.sql` in Supabase SQL Editor.
Run `supabase/seed.sql` to add launch-zone and demo events.

## Required Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `INTERNAL_JOB_SECRET`
- `NEXT_PUBLIC_DEFAULT_LAT`
- `NEXT_PUBLIC_DEFAULT_LNG`
- `NEXT_PUBLIC_DEFAULT_DISTANCE_MILES`
- `ADMIN_CLERK_USER_IDS`
- `REMINDER_TEST_MODE`

## Reminder Cron

EventDrop uses Supabase Cron for 30-minute RSVP reminders.

1. Deploy the Vercel app.
2. Set `INTERNAL_JOB_SECRET` in Vercel.
3. Run the commented `cron.schedule` SQL from `supabase/migrations/0001_init.sql`, replacing the deployed URL and secret.
4. For local/demo testing, set `REMINDER_TEST_MODE=true` to avoid sending real email while still exercising the reminder worker.

## Architecture Summary

Next.js on Vercel serves the public UI and API routes. Clerk protects write actions. Supabase Postgres with PostGIS stores events and powers distance filtering. Supabase Cron runs reminder checks and calls a protected Vercel route. Resend sends transactional reminder email.

## Deployment Notes

1. Create Supabase project and run SQL files in `supabase/`.
2. Create Clerk app and copy keys into Vercel env vars.
3. Create Resend API key and sender.
4. Deploy to Vercel.
5. Configure Supabase Cron after the Vercel URL exists.

## Test Credentials

Create one Clerk reviewer account before submission. Share credentials in private submission notes, not in the public repository.

## Verification

Before submission, run:

```bash
npm run typecheck
npm test
npm run build
npm run e2e
```

If any command requires cloud credentials, document the missing variable and verify again after setting it.
