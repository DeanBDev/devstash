// Prisma 7 no longer loads .env automatically.
import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI commands (migrate, studio) use Neon's direct connection when available,
// since migrations should not run through the connection pooler.
const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Prisma 7 no longer seeds automatically after migrate; run with `npm run db:seed`.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
