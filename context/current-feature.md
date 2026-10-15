# Current Feature

<!-- Feature Name and Description -->

Code Scanner Quick Wins - low-risk cleanups from the code-scanner audit. No behavior or UI changes.

## Status

In Progress

## Goals

- Wrap `getCurrentUserId()` in React `cache()` so it runs once per request (`src/lib/db/users.ts`)
- Extract a small `CardGrid` component for the grid markup repeated 3 times in `src/app/dashboard/page.tsx`
- Make `getInitials` in `SidebarUser.tsx` robust to empty name parts (`.filter(Boolean)`)

## Notes

- `src/lib/mock-data.ts` is intentionally left untouched for now
- Deliberately excluded as higher risk or needing design decisions: collection/item query rewrites, Suspense for the sidebar, seed transaction, seed password env var, `item-types.ts` map consolidation, replacing the mock sidebar user
- Verify with `npm run lint` and `npm run build`, then check the dashboard in the browser

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
