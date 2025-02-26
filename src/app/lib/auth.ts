import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Password Login",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials
      ): Promise<{ id: string; name: string } | null> => {
        const correctPassword = process.env.NEXT_PUBLIC_PASSWORD;
        if (credentials?.password === correctPassword) {
          return { id: "1", name: "Authorized User" };
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session, token }) {
      session.user!.email = token.email;
      session.user!.name = token.name;
      session.user!.image = token.picture;
      return session;
    },
    async jwt({ token, user, profile }) {
      if (user && profile) {
        token.id = user.id;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.image;
      }
      return token;
    },
  },
};
