# Current Feature: Auth UI - Sign In, Register & Sign Out

Replace the NextAuth default pages with custom sign-in and register pages, and add a user avatar with sign-out to the bottom of the sidebar.

## Status

In Progress

## Goals

- Create a custom sign-in page at `/sign-in`:
  - Email and password fields
  - "Sign in with GitHub" button
  - Link to the register page
  - Form validation and error display
- Create a register page at `/register`:
  - Name, email, password, confirm password fields
  - Validation (passwords match, email format)
  - Submit to `/api/auth/register`
  - Redirect to sign-in on success
- Update the bottom of the sidebar:
  - Show user avatar (GitHub image, or initials fallback) and user name
  - Dropdown opening upward on avatar click with a "Sign out" link
  - Clicking the icon goes to `/profile`
- Create a reusable avatar component handling both the image and initials cases

## Notes

- Spec: `context/features/auth-phase-3-spec.md`
- Avatar logic: use `user.image` if present, otherwise initials from the name (e.g. "Brad Traversy" -> "BT")
- Replaces the NextAuth default pages (set `pages.signIn` in the auth config; `src/proxy.ts` currently redirects to the default sign-in page)
- The spec's testing step 4 says "top bar" but the requirements say bottom of the sidebar; treating the sidebar as correct
- Testing:
  1. Go to `/sign-in` - verify the custom page renders
  2. Sign in with GitHub - verify the flow works
  3. Sign in with email/password - verify the flow works
  4. Verify the avatar shows (GitHub image or initials)
  5. Click the avatar - verify the dropdown appears
  6. Click "Sign out" - verify logout and redirect
  7. Go to `/register`, create a new account - verify redirect to sign-in

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
