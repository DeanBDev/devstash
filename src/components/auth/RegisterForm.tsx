"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormError from "@/components/auth/FormError";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/validations/auth";

const REGISTER_ERROR = "Something went wrong. Please try again.";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const result: { success: boolean; error?: string } = await response.json();
        if (result.success) {
          toast.success("Account created. You can now sign in.");
          router.push("/sign-in");
        } else {
          setError(result.error ?? REGISTER_ERROR);
        }
      } catch {
        setError(REGISTER_ERROR);
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={error} />
        <FormField id="name" name="name" label="Name" autoComplete="name" />
        <FormField id="email" name="email" type="email" label="Email" autoComplete="email" />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
