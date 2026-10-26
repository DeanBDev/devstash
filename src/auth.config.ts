import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-compatible config: providers and route rules only, no adapter.
export default {
  providers: [GitHub],
  callbacks: {
    authorized({ auth, request }) {
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
      return !isProtected || !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
