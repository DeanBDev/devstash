# Current Feature

<!-- Feature Name and Description -->

## Status

Completed

## Goals

<!-- Goals and Requirements -->

## Notes

<!--  Any extra notes -->

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
