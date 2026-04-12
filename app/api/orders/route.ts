import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import z from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session?.user.role);
  if (!session) {
    return NextResponse.json(
      {
        message: "認証されていないユーザーです",
      },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "管理者権限がありません",
      },
      { status: 403 },
    );
  }

  try {
    const { productId, quantity } = await req.json();
    const createOrderSchema = z.object({
      productId: z.string().min(1, "商品IDは必須です"),
      quantity: z.coerce.number().int().positive(),
    });
    const result = createOrderSchema.safeParse({ productId, quantity });
    if (!result.success) {
      return NextResponse.json(
        {
          message: "入力エラー",
          errors: result.error.message,
        },
        {
          status: 400,
        },
      );
    }
    const order = await prisma.$transaction(async (tx) => {
      const product = await tx.stored.findUnique({
        where: {
          product_id: productId,
        },
      });

      if (!product) {
        throw new Error("商品が存在しません");
      }

      if (product.current_stored >= product.minimum_stored * 3) {
        throw new Error("在庫数は十分に満たしています");
      }

      if (product.current_stored + quantity >= product.minimum_stored * 3) {
        throw new Error("在庫数は最大で最小在庫数の300%までです");
      }

      const order = await tx.order.create({
        data: {
          product_id: productId,
          quantity: quantity,
          status: "PENDING",
          userId: session.user.id,
        },
      });

      await tx.inventoryLog.create({
        data: {
          product_id: productId,
          type: "IN",
          quantity: quantity,
          userId: session.user.id,
          reason: "発注登録(未入庫)",
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });

      return order;
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
