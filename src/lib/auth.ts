import { NextAuthOptions, RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db'
import { compare } from "bcrypt"
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'based@aiaegis.org',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req:Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
      
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        console.log(user)
        if (!user) {
          return null;
        }
        console.log(user.password)
        const isPasswordMatch = await compare(
          credentials.password,
          user.password
        );
      
        if (!isPasswordMatch) {
          return null;
        }
      
        return {
          id: user.id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        email: token.email as string,
        isAdmin: token.isAdmin as boolean,
      };

      return session;
    },
  },
};
