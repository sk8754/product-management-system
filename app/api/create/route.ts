import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST (req:Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: "ログインされていません",
        }, {
            status: 401,
        })
    }
    try {
        const {productId, productName, category, currentStored, minimumStored, status} = await req.json();
        const data = await prisma.stored.create({
            data: {
                product_id: productId,
                product_name: productName,
                category: category,
                current_stored: Number(currentStored),
                minimum_stored: Number(minimumStored),
                status: status,
            }
        });

        return NextResponse.json({result: "success"}, {status: 200});
    }catch (error) {
        console.error(error);
        return NextResponse.json({error: "サーバーエラー"}, {status: 500});
    }
}