import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const requestApiKey = req.headers.get("x-api-key");

  let authorized = false;

  if (requestApiKey) {
    const keyRow = await prisma.apiKey.findFirst({
      where: { key: requestApiKey },
      select: { id: true },
    });
    if (!keyRow) {
      return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
    }
    authorized = true;
  } else if (session) {
    authorized = true;
  }

  if (!authorized) {
    return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
  }

  try {
    const storedData = await prisma.stored.findMany();
    return NextResponse.json(storedData);
  } catch (error) {
    console.error("Failed to fetch stored data:", error);
    return NextResponse.json(
      { message: "Failed to fetch stored data" },
      { status: 500 },
    );
  }
}
