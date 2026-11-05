import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/db";

const DAY = 24 * 60 * 60;
const SESSION_SHORT = DAY;
const SESSION_LONG = 30 * DAY;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: SESSION_LONG,
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        rememberMe: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await getUserByEmail(email.trim().toLowerCase());
        if (!user) return null;

        const matches = await compare(password, user.passwordHash);
        if (!matches) return null;

        const rememberMe = credentials?.rememberMe === "true" || credentials?.rememberMe === "on";
        return { id: String(user.id), email: user.email, rememberMe };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.rememberMe = Boolean(user.rememberMe);
        const maxAge = token.rememberMe ? SESSION_LONG : SESSION_SHORT;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
