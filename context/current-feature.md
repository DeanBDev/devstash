# Current Feature: Email Verification on Register

Require new email/password users to verify their email address by clicking a link sent via Resend before they can sign in.

## Status

In Progress

## Goals

- Install the `resend` package and add an email helper in `src/lib/email.ts`
- On `POST /api/auth/register`, after creating the user:
  - Generate a secure random verification token with a 24 hour expiry
  - Store it in the existing `VerificationToken` model (no schema change expected)
  - Email the user a verification link via Resend
- Create `GET /api/auth/verify` (token + email):
  - Validate the token and expiry, set `User.emailVerified`, and delete the token
  - Redirect to `/sign-in` with a success or failure message
- Block credentials sign-in for users whose email is not verified, with a clear "verify your email" message on the sign-in page
- Update the register flow toast to tell the user to check their email for the verification link
- GitHub OAuth sign-in is unaffected; the seeded demo user stays able to sign in (already has `emailVerified`)

## Notes

- `RESEND_API_KEY` is in `.env`; add a placeholder for it to `.env.example`
- Also needs a from-address and app base URL env vars (e.g. `EMAIL_FROM`, `AUTH_URL`/`NEXT_PUBLIC_APP_URL`); until a sending domain is verified in Resend, `onboarding@resend.dev` only delivers to the Resend account owner's email
- Reuse the `VerificationToken` table; if a schema change turns out to be needed, use `prisma migrate dev` only (never `db push`) and the Neon `development` branch only
- Validate input with Zod; verify route must not leak whether an email exists
- Not in scope: resend-verification email, password reset
- Testing:
  1. Register with a real inbox the Resend account can deliver to
  2. Verify the email arrives with a working link
  3. Try to sign in before verifying - verify it is blocked with a clear message
  4. Click the link - verify redirect to `/sign-in` with a success message
  5. Sign in - verify redirect to `/dashboard`
  6. Reuse the link and try an expired token - verify a failure message
  7. Verify GitHub sign-in and the demo user still work

## History

<!-- Keep this updated.  Earliest to latest -->

- **Initial Setup** - Next.js 16, Tailwind CSS v4, TypeScript (Completed)
- **Dashboard UI Phase 1** - shadcn/ui setup, /dashboard route, dark mode default, top bar with search and new item button, sidebar/main placeholders (Completed)
- **Dashboard UI Phase 2** - Collapsible shadcn sidebar (icon mode, cookie-persisted, drawer on mobile), sidebar toggle in top bar, item types with counts linking to /items/[type], favorite and recent collections with counts, user avatar area (Completed)
- **Dashboard UI Phase 3** - Main dashboard area: 4 color-coded stats cards (items, collections, favorite items, favorite collections), recent collections grid, pinned items, 10 recent items, type-colored collection and item cards (Completed)
- **Database Setup** - Prisma 7 with Neon PostgreSQL: `prisma-client` generator, `prisma.config.ts`, Neon driver adapter client singleton, initial schema (NextAuth + app models) with indexes and cascade deletes, `init` migration, idempotent system item type seed, db npm scripts (Completed)
- **Seed Data** - Demo user (demo@devstash.io, bcryptjs-hashed password), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 sample snippets, prompts, commands, and links; idempotent re-runs; `db:test` now displays and verifies the demo data (Completed)
- **Dashboard Collections** - Recent collections grid and collection stats now load from Neon via Prisma (`src/lib/db/collections.ts`); card border color from the most-used item type (falls back to default type), type icons ordered by usage; dashboard rendered per request; temporary demo-user lookup until auth (Completed)
- **Dashboard Items** - Pinned and recent items plus item stats now load from Neon via Prisma (`src/lib/db/items.ts`); item card icon/border/label from the item type, tags shown; pinned section hidden when empty; recent items ordered by last used then created; seed now sets pinned, favorite, tags, and lastUsedAt on demo items and favorites on two collections (Completed)
- **Stats & Sidebar** - Sidebar now loads from Neon via Prisma: system item types with per-user counts (`getSystemItemTypes`) linking to /items/[slug] with Pro badges, favorite collections (star) and recent non-favorite collections (dot colored by most-used type), "View all collections" link to /collections; stats verified from DB; removed unused mock helpers (`src/lib/collections.ts`, `src/lib/items.ts`, `getItemTypeById`) (Completed)
- **Pro Badge Sidebar** - Files and Images types in the sidebar show a subtle uppercase PRO badge (shadcn Badge, outline variant, muted text) placed next to the type label, hidden when the sidebar is collapsed (Completed)
- **Code Scanner Quick Wins** - Low-risk cleanups from the code-scanner audit: `getCurrentUserId` wrapped in React `cache()`, extracted `CardGrid` component for the dashboard card grids, `getInitials` ignores empty name parts (Completed)
- **Auth Phase 1** - NextAuth v5 (`next-auth@beta`) with Prisma adapter and GitHub OAuth: split config (`src/auth.config.ts` edge-safe, `src/auth.ts` with JWT sessions and `user.id` on the session), `/api/auth/[...nextauth]` handlers, `src/proxy.ts` protecting `/dashboard/*` and redirecting to the default sign-in page, session type extension (Completed)
- **Auth Phase 2** - Email/password sign-in: Credentials provider placeholder in `src/auth.config.ts` (with email/password form fields) overridden in `src/auth.ts` with Zod-validated bcryptjs `authorize`; `POST /api/auth/register` validates name, email, password (min 8) and matching confirmPassword with Zod, rejects existing emails (409), hashes with bcryptjs and creates the user; added `zod` dependency (Completed)
- **Auth Phase 3** - Custom auth UI: `/sign-in` (email/password, GitHub button, error display) and `/register` (Zod-validated, posts to `/api/auth/register`, Sonner toast then redirect to sign-in) replacing the NextAuth default pages (`pages.signIn`); shared Zod schemas in `src/lib/validations/auth.ts`; sign-in/sign-out server actions; reusable `UserAvatar` (image or initials); sidebar user menu with Profile and Sign out dropdown opening upward; `getCurrentUserId` and the sidebar now use the session instead of the demo user; React Compiler enabled (Completed)
