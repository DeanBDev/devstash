import { prisma } from "@/lib/prisma";

// Temporary until auth is wired up: the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";

export async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}
