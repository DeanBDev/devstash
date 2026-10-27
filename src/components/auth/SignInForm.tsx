"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { signInWithCredentials, signInWithGitHub } from "@/actions/auth";
import FormError from "@/components/auth/FormError";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInSchema } from "@/lib/validations/auth";

interface SignInFormProps {
  initialError: string | null;
}

export default function SignInForm({ initialError }: SignInFormProps) {
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = signInSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await signInWithCredentials(parsed.data);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={error} />
        <FormField id="email" name="email" type="email" label="Email" autoComplete="email" />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Separator />

      <form action={signInWithGitHub}>
        <Button type="submit" variant="outline" className="w-full">
          Sign in with GitHub
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground underline underline-offset-4">
          Register
        </Link>
      </p>
    </>
  );
}
