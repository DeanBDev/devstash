import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

function getErrorMessage(error: string | string[]): string {
  return error === "VerificationFailed"
    ? "This verification link is invalid or has expired."
    : "Sign in failed. Please try again.";
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { error, verified } = await searchParams;

  return (
    <AuthCard title="Sign in to DevStash" description="Welcome back. Enter your details below.">
      <SignInForm
        initialError={error ? getErrorMessage(error) : null}
        emailVerified={verified === "true"}
      />
    </AuthCard>
  );
}
