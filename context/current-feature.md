# Current Feature: Auth Phase 2 - Email/Password Credentials Provider

Add a Credentials provider for email/password authentication, with a registration API route.

## Status

In Progress

## Goals

- Use bcryptjs for hashing (already installed)
- Confirm the `password` field exists on the User model (add via migration only if missing)
- Add a Credentials provider placeholder (`authorize: () => null`) to `src/auth.config.ts`
- Override the Credentials provider in `src/auth.ts` with bcrypt validation
- Create `POST /api/auth/register`:
  - Accept name, email, password, confirmPassword
  - Validate that the passwords match
  - Check whether the user already exists
  - Hash the password with bcryptjs
  - Create the user in the database
  - Return a success/error response

## Notes

- Spec: `context/features/auth-phase-2-spec.md`
- Split pattern: `auth.config.ts` keeps the edge-safe placeholder; `auth.ts` supplies the real bcrypt `authorize`
- Credentials provider docs: https://authjs.dev/getting-started/authentication/credentials
- Testing:
  1. Register via curl: `curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"password123","confirmPassword":"password123"}'`
  2. Go to `/api/auth/signin`
  3. Sign in with email/password
  4. Verify redirect to `/dashboard`
  5. Verify GitHub OAuth still works
- Project rules: validate input with Zod, use migrations (never `db push`), and only use the Neon `development` branch

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
