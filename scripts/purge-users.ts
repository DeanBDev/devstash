// Loads .env before the Prisma client reads DATABASE_URL (Prisma 7 doesn't load it automatically).
import "dotenv/config";
import { DEMO_USER } from "../prisma/seed-data";
import { prisma } from "../src/lib/prisma";

const CONFIRM_FLAG = "--yes";

// Everyone except the demo user, including users that have no email.
const NOT_DEMO_USER = { OR: [{ email: null }, { email: { not: DEMO_USER.email } }] };

function getDatabaseHost(): string {
  return new URL(process.env.DATABASE_URL ?? "").host;
}

async function countOthers() {
  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count({ where: NOT_DEMO_USER }),
    prisma.item.count({ where: { user: NOT_DEMO_USER } }),
    prisma.collection.count({ where: { user: NOT_DEMO_USER } }),
    prisma.tag.count({ where: { user: NOT_DEMO_USER } }),
  ]);
  return { users, items, collections, tags };
}

async function main(): Promise<void> {
  const demoUser = await prisma.user.findUnique({ where: { email: DEMO_USER.email } });
  if (!demoUser) {
    throw new Error(`Demo user ${DEMO_USER.email} not found; refusing to delete everyone.`);
  }

  console.log(`Database host: ${getDatabaseHost()}`);
  console.log(`Keeping: ${DEMO_USER.email}`);
  const counts = await countOthers();
  console.log("Will delete:", counts);

  if (!process.argv.includes(CONFIRM_FLAG)) {
    console.log(`\nDry run. Re-run with ${CONFIRM_FLAG} to delete.`);
    return;
  }

  // Accounts, sessions, items, collections, tags and custom item types cascade from the user.
  const { count: users } = await prisma.user.deleteMany({ where: NOT_DEMO_USER });
  // Verification tokens reference an email, not a user, so they don't cascade.
  const { count: tokens } = await prisma.verificationToken.deleteMany({
    where: { identifier: { not: DEMO_USER.email } },
  });

  console.log(`\nDeleted ${users} users (and their content) and ${tokens} verification tokens.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
