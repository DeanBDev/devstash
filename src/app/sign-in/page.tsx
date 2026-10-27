import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { error } = await searchParams;

  return (
    <AuthCard title="Sign in to DevStash" description="Welcome back. Enter your details below.">
      <SignInForm initialError={error ? "Sign in failed. Please try again." : null} />
    </AuthCard>
  );
}
