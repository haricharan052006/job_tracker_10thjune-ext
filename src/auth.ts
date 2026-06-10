import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  // Use JWT sessions so CredentialsProvider works with PrismaAdapter
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
      : []),

    // --- Temporary Credentials Provider for local testing ---
    Credentials({
      name: "Test Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "any value" },
        password: { label: "Password", type: "password", placeholder: "any value" },
      },
      async authorize(credentials) {
        // Accept any non-empty username/password for local testing
        const username = credentials?.username as string | undefined;
        if (!username) return null;

        const email = `${username.toLowerCase().replace(/\s+/g, ".")}@test.local`;

        // Find or create a test user in the database
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: username,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    // Persist the user id from the DB into the JWT token
    async jwt({ token, user }) {
      const u = user as any;
      if (u?.id) {
        (token as any).sub = u.id;
      }
      return token;
    },
    // Expose the user id on the session object (needed by dashboard)
    async session({ session, token }) {
      const t = token as any;
      if (t.sub && session.user) {
        (session.user as any).id = t.sub;
      }
      return session;
    },
  },
});
