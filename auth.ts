import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { USER_ROLES, type UserRole } from "@/types/user";

/** Comparé quand l'e-mail est inconnu, pour que la réponse prenne le même temps (D-30). */
const DUMMY_HASH = "$2b$12$oYve8LEOVGbPfYIWWGPWbORLJlaQB9Kc3bJDc.TTBFmmkVCtbYQ5O";

function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = typeof credentials.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !valid) return null;

        return { id: user.id as string, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        if (isRole(user.role)) token.role = user.role;
      }
      if (trigger === "update" && session?.user) {
        if (typeof session.user.name === "string") token.name = session.user.name;
        if (typeof session.user.email === "string") token.email = session.user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      if (isRole(token.role)) session.user.role = token.role;
      return session;
    },
  },
});
