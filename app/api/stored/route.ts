import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const storedData = await prisma.stored.findMany();
    return NextResponse.json(storedData);
  } catch (error) {
    console.error("Failed to fetch stored data:", error);
    return NextResponse.json(
      { message: "Failed to fetch stored data" },
      { status: 500 }
    );
  }
}

