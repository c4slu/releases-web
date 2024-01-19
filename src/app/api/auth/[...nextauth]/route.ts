import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

type UserProps = {
  password: string;
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}[];

export const prisma = new PrismaClient();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const userFound: any = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!userFound) throw new Error("User not found");

        const matchpassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!matchpassword) throw new Error("Password not found");
        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
};

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
