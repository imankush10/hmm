import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    email: "admin@lcaplatform.com",
    password: "$2b$12$BYU9/vnWztrMQaCkHgKzP.UHEmukvDpmMEsGxtbTuiMnX2ypYpkf.", // hashed "admin123"
    name: "Admin User",
    role: "admin",
    department: "Environmental Management",
    avatar: null,
  },
  {
    id: "2",
    email: "user@lcaplatform.com",
    password: "$2b$12$H/1amUQSwsvYgJSJIgRUMuVKctojVTkwe/jhqNTtdos0hCiV7m.li", // hashed "user123"
    name: "Regular User",
    role: "user",
    department: "Operations",
    avatar: null,
  },
  {
    id: "3",
    email: "analyst@lcaplatform.com",
    password: "$2b$12$EOko7RGhcBHswcK6dqQWZ.nykYxViK/ruO/u45uCpvae9xE0QbUQe", // hashed "analyst123"
    name: "Data Analyst",
    role: "user",
    department: "Analytics",
    avatar: null,
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((user) => user.email === credentials.email);
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.department = token.department;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
