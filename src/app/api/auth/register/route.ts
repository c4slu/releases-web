import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    const userFound = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (emailFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    if (userFound) {
      return NextResponse.json(
        { message: "UserName already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: data.username.toString(),
        email: data.email.toString(),
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json({ user, message: "Sucess..." });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
