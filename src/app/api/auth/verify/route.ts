import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmailWithToken } from "@/lib/db/verification";

const verifySchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

function redirectToSignIn(request: Request, query: string) {
  return NextResponse.redirect(new URL(`/sign-in?${query}`, request.url));
}

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = verifySchema.safeParse(params);
  if (!parsed.success) return redirectToSignIn(request, "error=VerificationFailed");

  try {
    const verified = await verifyEmailWithToken(parsed.data.email, parsed.data.token);
    return redirectToSignIn(request, verified ? "verified=true" : "error=VerificationFailed");
  } catch {
    return redirectToSignIn(request, "error=VerificationFailed");
  }
}
