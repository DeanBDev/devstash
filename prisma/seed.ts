import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { DEMO_USER, SEED_COLLECTIONS, SYSTEM_TYPES, type SeedItem } from "./seed-data";

const BCRYPT_ROUNDS = 12;
const HOUR_MS = 60 * 60 * 1000;

async function seedSystemTypes(): Promise<void> {
  for (const { id, ...type } of SYSTEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id },
      update: { ...type, isSystem: true, userId: null },
      create: { id, ...type, isSystem: true },
    });
  }
}

async function seedDemoUser(): Promise<string> {
  const password = await bcrypt.hash(DEMO_USER.password, BCRYPT_ROUNDS);
  const data = { name: DEMO_USER.name, password, isPro: false, emailVerified: new Date() };

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: data,
    create: { email: DEMO_USER.email, ...data },
  });
  return user.id;
}

function toItemFields(item: SeedItem) {
  if (item.type === "type_link") {
    return { contentType: "URL" as const, url: item.url };
  }
  return { contentType: "TEXT" as const, content: item.content, language: item.language ?? null };
}

function toMetaFields(item: SeedItem, userId: string) {
  return {
    isPinned: item.isPinned ?? false,
    isFavorite: item.isFavorite ?? false,
    lastUsedAt:
      item.lastUsedHoursAgo === undefined
        ? null
        : new Date(Date.now() - item.lastUsedHoursAgo * HOUR_MS),
    tags: {
      connectOrCreate: (item.tags ?? []).map((name) => ({
        where: { userId_name: { userId, name } },
        create: { userId, name },
      })),
    },
  };
}

// Recreates the demo user's collections, items, and tags so re-running the seed doesn't duplicate them.
async function seedCollections(userId: string): Promise<number> {
  await prisma.item.deleteMany({ where: { userId } });
  await prisma.collection.deleteMany({ where: { userId } });
  await prisma.tag.deleteMany({ where: { userId } });

  let itemCount = 0;
  for (const { name, description, isFavorite, items } of SEED_COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: { name, description, isFavorite: isFavorite ?? false, userId },
    });

    for (const item of items) {
      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          ...toItemFields(item),
          ...toMetaFields(item, userId),
          userId,
          itemTypeId: item.type,
          collections: { create: { collectionId: collection.id } },
        },
      });
      itemCount++;
    }
  }
  return itemCount;
}

async function main(): Promise<void> {
  await seedSystemTypes();
  console.log(`Seeded ${SYSTEM_TYPES.length} system item types`);

  const userId = await seedDemoUser();
  console.log(`Seeded demo user ${DEMO_USER.email}`);

  const itemCount = await seedCollections(userId);
  console.log(`Seeded ${SEED_COLLECTIONS.length} collections with ${itemCount} items`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
