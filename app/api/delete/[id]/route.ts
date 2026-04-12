import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface Params {
    params: Promise<{
        id: string
    }>
}

export async function DELETE(req:Request, {params}: Params) {
    const { id } = await params
    try {
        const result = await prisma.stored.delete({
            where: {
                id: Number(id),
            }
        })

        return NextResponse.json({
            status: 200,
        })
    }catch (error) {
        return NextResponse.json({status: 500})
    }
}