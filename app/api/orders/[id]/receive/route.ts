import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stored_status } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        message: "認証されていません",
      },
      {
        status: 401,
      },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "管理者権限がありません",
      },
      {
        status: 403,
      },
    );
  }

  try {
    const { id } = await params;
    const orderId = Number(id);

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          status: "PENDING",
        },
        data: {
          status: "DELIVERED",
        },
      });

      if (updated.count === 0) {
        throw new Error("既に処理済みです");
      }

      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new Error("注文が存在しません");
      }

      const stored = await tx.stored.findUnique({
        where: {
          product_id: order.product_id,
        },
      });

      if (!stored) {
        throw new Error("在庫情報が存在しません");
      }
      const newStock = stored.current_stored + order.quantity;

      let newStatus: stored_status;

      if (newStock <= stored.minimum_stored) {
        newStatus = "alert";
      } else if (newStock < stored.minimum_stored * 1.5) {
        newStatus = "caution";
      } else {
        newStatus = "normal";
      }

      await tx.stored.update({
        where: {
          product_id: order.product_id,
        },
        data: {
          current_stored: newStock,
          status: newStatus,
        },
      });

      await tx.inventoryLog.create({
        data: {
          product_id: order.product_id,
          type: "IN",
          quantity: order.quantity,
          userId: session.user.id,
          reason: "入庫完了（発注受け取り)",
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });

      return order;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }
}
