# Changelog

All notable changes to the SSTB app are recorded here.

## [Unreleased] — 2026-11-06 — Security hardening

### ⚠️ Action required after deploying

1. **Run the database migration**: `npx prisma migrate deploy`
   (adds `User.token_version`; existing users keep working, existing sessions stay valid).
2. **Change the production admin password** if it is still `Admin@1234` (log in → Settings).
3. **Any volunteer still using `Volunteer@1234` must change it** (or use "Forgot password").
4. **New environment variables:**
   | Variable | Where | Purpose |
   |---|---|---|
   | `SEED_ADMIN_PASSWORD` | only when running `npm run seed` | Initial admin password (min 12 chars). Required now. |
   | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME` | optional, seed only | Override the default admin email/name. |
   | `DEV_ALLOWED_ORIGINS` | optional, `.env.local` | Comma-separated IPs allowed to reach `next dev` (replaces the hardcoded `172.23.224.1`). |
5. Make sure `RESEND_API_KEY` and `NEXTAUTH_URL` are set in production. Volunteer welcome emails use them.

### 1. Finance transactions locked down to admins & finance volunteers
`app/api/transactions/route.ts`
- **Before:** any logged-in user (including regular volunteers) could create transactions and change balances; input was not validated.
- **Now:** returns `403` unless the user is an admin or a finance volunteer.
- Validates `person_type`, `direction`, `payment_method` against allowed values, requires a positive amount (≤ 1,000,000, rounded to cents), a non-empty description, and checks that the student/volunteer actually exists. Text fields are length-capped.

### 2. HTML injection in emails fixed
- New `escapeHtml()` helper in `lib/security.ts`.
- `app/api/contact/route.ts`: name, email, subject and message are escaped before being put into the email HTML; line breaks are stripped from the subject header; field lengths are capped (message ≤ 5,000 chars); `replyTo` is now set to the sender.
- `app/api/auth/forgot-password/route.ts`: the user's name is escaped in the reset email.
- **Removed `app/api/route.ts`**, an unused duplicate of the contact endpoint that had the same injection problem and was publicly reachable at `/api`.

### 3. Hardcoded default passwords removed
- `app/api/volunteer-applications/[id]/route.ts`: accepting a volunteer with "Create dashboard login" **no longer sets the password `Volunteer@1234`**. The account gets a random password nobody knows, and the volunteer is emailed a **"Set your password" link** (valid 3 days, using the existing reset-password page).
  - If the email can't be sent (e.g. Resend not configured), the admin is shown the link to share manually.
  - Returns `409` if a dashboard account with that email already exists.
  - The application update, user creation, token and volunteer record are now written in a **single database transaction**, so a failure no longer leaves half-created records.
- `app/dashboard/admin/volunteers/VolunteerApplicationsClient.tsx`: shows the invite result and real error messages.
- `prisma/seed.ts`: the admin password now comes from `SEED_ADMIN_PASSWORD` (required, min 12 chars) instead of the hardcoded `Admin@1234`.

### 4. Rate limiting on public & sensitive endpoints
New in-memory limiter in `lib/security.ts` (`rateLimit`, `limitByIp`). Over-limit requests get `429 Too many requests`.

| Endpoint | Limit |
|---|---|
| Login (`lib/auth.ts`) | 10 attempts / 15 min per email, 30 / 15 min per IP |
| `POST /api/contact` | 5 / 10 min per IP |
| `POST /api/applications` | 5 / hour per IP |
| `POST /api/volunteer-applications` | 5 / hour per IP |
| `POST /api/auth/forgot-password` | 5 / 15 min per IP, 3 emails / hour per account |
| `POST /api/auth/reset-password` | 10 / 15 min per IP |
| `PATCH /api/settings/password` | 5 / 15 min per user |

> Note: limits are per server instance. That's fine for a single server; for multi-instance/serverless hosting, move the store to Redis (e.g. Upstash).

Also: login email lookup is now case-insensitive.

### 5. Password rules & session revocation
- New `validatePassword()` (min 8 chars) used by **Settings → change password**, **reset password**, and **admin "add user"** (`/api/users`). Previously Settings accepted an empty password.
- `/api/users` also rejects roles other than `admin` / `volunteer`.
- New `User.token_version` column (migration `20261106000000_add_user_token_version`).
  - Changing or resetting a password increments it → **all existing sessions on every device are signed out**.
  - The session is re-checked against the database every 60 seconds (`lib/auth.ts`), so **role changes, demotions and deleted users take effect within a minute**, and name/email changes are picked up.
- Reset-password now updates the password and marks the token used in one transaction.
- Settings page signs the user out after a password change and asks them to log in again.

### 6. Internal errors no longer sent to the browser
- New `serverError()` helper logs the real error on the server and returns a generic `"Something went wrong"` message.
- Replaced every `{ error: String(err) }` response in: news, news/[id], users, applications/[id], students/[id], settings/profile, settings/password, transactions, volunteer-applications/[id], reset-password, contact.

### 7. Dev-only config cleaned up
- `next.config.ts`: removed the hardcoded `allowedDevOrigins: ['172.23.224.1']`; use the optional `DEV_ALLOWED_ORIGINS` env var instead.

### 8. Lost payments under concurrent writes fixed (found by stress test)
`app/api/transactions/route.ts`
- **Before:** the balance was read, added to in JavaScript, then written back. In a test, 25 payments recorded at the same moment only raised `total_paid` by $4 instead of $25. **$21 was lost.**
- **Now:** the transaction insert and the balance update run in one database transaction, and the balance is updated with a single atomic SQL `UPDATE ... SET total_paid = total_paid + amount, balance_due = GREATEST(0, ...)`. Re-test: 25/25 payments reflected, $0 lost.
- ⚠️ Balances already in production may have been affected before this fix. They can be rebuilt from the `Transaction` table if needed.

### Verification
- `tsc --noEmit` passes; `next build` succeeds.
- ESLint: no new rule categories; remaining errors are all the pre-existing `@typescript-eslint/no-explicit-any` style.
- **Stress/security test: 82/82 checks passed** against a production build (`next start`) and a real PostgreSQL 16 database (Docker), with all migrations applied:
  - Fix 1: 401/403/201 by role; 14 kinds of malformed or hostile input rejected; nonexistent person returns 404; long text capped.
  - Fix 2: old `/api` endpoint gone; hostile/oversized contact input handled without leaks.
  - Fix 3: `Volunteer@1234` no longer works; setup link valid ~72h and single-use; duplicate email returns 409 with nothing half-created; **5 simultaneous accepts create exactly 1 user + 1 volunteer**.
  - Fix 4: every limit enforced exactly under concurrent bursts (e.g. 50 parallel applications → exactly 5 allowed); account lock after 10 bad logins; IP lock after 30 (password spraying); other IPs unaffected.
  - Fix 5: weak/empty passwords and invalid roles rejected; after a password change the **other device is signed out**; a **demoted finance volunteer loses access within 60s**; admin sessions unaffected.
  - Fix 6: six error-triggering requests return no Prisma/stack details.
  - Fix 8: 25 simultaneous payments, 0 lost.
  - Load (one local server): 200 concurrent requests to `/` and `/api/news`, 200 authenticated dashboard loads, and 100 concurrent logins, all with **zero 5xx errors**. Dashboard p95 was ~5.2s at 200 concurrent requests. That is the main thing to improve next: share one Prisma client across the app (review item #14).
- Known limitation: the rate limiter trusts the `X-Forwarded-For` header. That is correct behind Vercel or another proxy that sets it, but on a bare server with no proxy, clients could spoof it.
