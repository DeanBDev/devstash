"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn, signOut } from "@/auth";
import { EMAIL_NOT_VERIFIED_CODE } from "@/lib/auth-errors";
import { signInSchema } from "@/lib/validations/auth";
import type { ActionResult } from "@/types/actions";

const DEFAULT_REDIRECT = "/dashboard";

export async function signInWithCredentials(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: DEFAULT_REDIRECT });
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error instanceof CredentialsSignin && error.code === EMAIL_NOT_VERIFIED_CODE) {
        return { success: false, error: "Please verify your email before signing in" };
      }
      return { success: false, error: "Invalid email or password" };
    }
    throw error;
  }
}

export async function signInWithGitHub(): Promise<void> {
  await signIn("github", { redirectTo: DEFAULT_REDIRECT });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}
