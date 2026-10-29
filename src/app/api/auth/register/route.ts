import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createVerificationToken, deleteVerificationTokens } from "@/lib/db/verification";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

const BCRYPT_ROUNDS = 12;

async function sendVerification(request: Request, email: string): Promise<boolean> {
  const token = await createVerificationToken(email);
  const baseUrl = process.env.APP_URL ?? new URL(request.url).origin;
  const verifyUrl = `${baseUrl}/api/auth/verify?${new URLSearchParams({ email, token })}`;
  return sendVerificationEmail(email, verifyUrl);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    const sent = await sendVerification(request, email);
    if (!sent) {
      await prisma.user.delete({ where: { id: user.id } });
      await deleteVerificationTokens(email);
      return NextResponse.json(
        { success: false, error: "Could not send the verification email. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 },
    );
  }
}
