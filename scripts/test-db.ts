// Loads .env before the Prisma client reads DATABASE_URL (Prisma 7 doesn't load it automatically).
import "dotenv/config";
import bcrypt from "bcryptjs";
import { DEMO_USER, SEED_COLLECTIONS } from "../prisma/seed-data";
import { prisma } from "../src/lib/prisma";

const EXPECTED_SYSTEM_TYPES = 7;
const TEST_EMAIL = `test-db-${Date.now()}@devstash.test`;

let failures = 0;

function check(label: string, passed: boolean, detail = ""): void {
  if (!passed) failures++;
  console.log(`${passed ? "✅" : "❌"} ${label}${detail ? ` (${detail})` : ""}`);
}

// First line of the text, shortened with an ellipsis if anything was cut off.
function truncate(text: string, length: number): string {
  const firstLine = text.split("\n")[0];
  return firstLine.length > length || text.includes("\n")
    ? `${firstLine.slice(0, length)}…`
    : firstLine;
}

async function checkConnection(): Promise<void> {
  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;
  check("Connected to database", now instanceof Date, now.toISOString());
}

async function checkMigrations(): Promise<void> {
  const migrations = await prisma.$queryRaw<{ migration_name: string }[]>`
    SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL
  `;
  check(
    "Migrations applied",
    migrations.length > 0,
    migrations.map((migration) => migration.migration_name).join(", ")
  );
}

async function checkSystemTypes(): Promise<void> {
  const types = await prisma.itemType.findMany({ where: { isSystem: true, userId: null } });
  check(
    `System item types seeded (${EXPECTED_SYSTEM_TYPES})`,
    types.length === EXPECTED_SYSTEM_TYPES,
    `found ${types.length}`
  );
}

async function checkDemoUser() {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER.email } });
  check(`Demo user exists (${DEMO_USER.email})`, user !== null);
  if (!user) return null;

  const passwordMatches = user.password
    ? await bcrypt.compare(DEMO_USER.password, user.password)
    : false;
  check("Demo user password hash matches", passwordMatches);
  check("Demo user is verified and not Pro", user.emailVerified !== null && !user.isPro);
  return user;
}

// Fetches the demo user's collections and items, prints them, and compares against the seed data.
async function checkDemoData(): Promise<void> {
  const user = await checkDemoUser();
  if (!user) return;

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      items: { include: { item: { include: { itemType: true } } } },
    },
  });

  console.log(`\n📦 ${user.name} — ${collections.length} collections`);
  for (const collection of collections) {
    console.log(`\n  ${collection.name} (${collection.items.length} items) — ${collection.description}`);
    for (const { item } of collection.items) {
      const detail = item.url ?? truncate(item.content ?? "", 50);
      console.log(`    • [${item.itemType.name}] ${item.title} — ${detail}`);
    }

    const expected = SEED_COLLECTIONS.find((seed) => seed.name === collection.name);
    check(
      `${collection.name} matches seed`,
      expected?.items.length === collection.items.length,
      `expected ${expected?.items.length ?? 0}, found ${collection.items.length}`
    );
  }
  console.log();

  const expectedItems = SEED_COLLECTIONS.reduce((total, seed) => total + seed.items.length, 0);
  const itemCount = await prisma.item.count({ where: { userId: user.id } });
  check(
    `Demo data has ${SEED_COLLECTIONS.length} collections and ${expectedItems} items`,
    collections.length === SEED_COLLECTIONS.length && itemCount === expectedItems,
    `found ${collections.length} collections, ${itemCount} items`
  );
}

// Creates a user with an item, collection, and tag, reads it back, then deletes the user
// and confirms everything they own was removed by cascade deletes.
async function checkCrudAndCascade(): Promise<void> {
  const user = await prisma.user.create({ data: { email: TEST_EMAIL, name: "DB Test" } });
  const collection = await prisma.collection.create({
    data: { name: "Test Collection", userId: user.id },
  });
  const item = await prisma.item.create({
    data: {
      title: "Test snippet",
      contentType: "TEXT",
      content: "console.log('hello')",
      userId: user.id,
      itemTypeId: "type_snippet",
      tags: { create: { name: "test", userId: user.id } },
      collections: { create: { collectionId: collection.id } },
    },
  });

  const saved = await prisma.item.findUnique({
    where: { id: item.id },
    include: { itemType: true, tags: true, collections: true },
  });
  check(
    "Created and read item with relations",
    saved?.itemType.slug === "snippets" && saved.tags.length === 1 && saved.collections.length === 1
  );

  await prisma.user.delete({ where: { id: user.id } });

  const [items, collections, tags] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.tag.count({ where: { userId: user.id } }),
  ]);
  check("Deleting user cascades to items, collections, and tags", items + collections + tags === 0);
}

async function main(): Promise<void> {
  console.log("Testing database...\n");

  try {
    await checkConnection();
    await checkMigrations();
    await checkSystemTypes();
    await checkDemoData();
    await checkCrudAndCascade();
  } catch (error) {
    failures++;
    console.error("❌ Unexpected error:", error);
  } finally {
    // Safety net in case a check failed before the test user was deleted.
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  }

  console.log(failures === 0 ? "\nAll database checks passed." : `\n${failures} check(s) failed.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

await main();
