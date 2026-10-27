"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
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
