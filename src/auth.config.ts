import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

export const CREDENTIAL_FIELDS = {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
};

// Edge-compatible config: providers and route rules only, no adapter.
// The Credentials authorize is a placeholder; auth.ts supplies the bcrypt check.
export default {
  providers: [GitHub, Credentials({ credentials: CREDENTIAL_FIELDS, authorize: () => null })],
  callbacks: {
    authorized({ auth, request }) {
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
      return !isProtected || !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
