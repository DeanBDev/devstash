// Loads .env before the Prisma client reads DATABASE_URL (Prisma 7 doesn't load it automatically).
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const EXPECTED_SYSTEM_TYPES = 7;
const TEST_EMAIL = `test-db-${Date.now()}@devstash.test`;

let failures = 0;

function check(label: string, passed: boolean, detail = ""): void {
  if (!passed) failures++;
  console.log(`${passed ? "✅" : "❌"} ${label}${detail ? ` (${detail})` : ""}`);
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
