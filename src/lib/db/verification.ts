import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Only the hash is stored, so a database leak can't be used to verify accounts.
export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(TOKEN_BYTES).toString("hex");

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashToken(token),
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  return token;
}

export async function verifyEmailWithToken(email: string, token: string): Promise<boolean> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: hashToken(token) } },
  });
  if (!record) return false;

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: record.token } },
  });
  if (record.expires < new Date()) return false;

  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });
  return true;
}

export async function deleteVerificationTokens(email: string): Promise<void> {
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
}
