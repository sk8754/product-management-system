import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      {
        message: "メールアドレスとパスワードは必須です",
      },
      {
        status: 400,
      },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "このメールアドレスは既に使用されています",
      },
      {
        status: 400,
      },
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  return NextResponse.json(
    {
      message: "ユーザー登録が完了しました。",
    },
    {
      status: 201,
    },
  );
}
