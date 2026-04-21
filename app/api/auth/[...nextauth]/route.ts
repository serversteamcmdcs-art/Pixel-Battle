// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Никнейм", type: "text" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string }
        });

        // Для демо — любой существующий пользователь может войти
        if (user) {
          return { id: user.id, username: user.username, email: user.email };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin", // можно позже сделать свою страницу
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
