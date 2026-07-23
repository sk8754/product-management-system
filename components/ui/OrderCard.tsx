"use client";
import React from "react";
import { Button } from "./button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Order } from "@/app/generated/prisma/client";
import { OrderWithRelations } from "@/lib/types/order";
import { mutate } from "swr";

interface OrderCardProps {
  data: OrderWithRelations;
}

const handleReceive = async (orderId: number) => {
  try {
    const res = await axios.post(`/api/orders/${orderId}/receive`);
    console.log(res.status);
    mutate("/api/orders");
  } catch (error) {
    console.error(error);
  }
};

const OrderCard = ({ data }: OrderCardProps) => {
  const expectedDate = new Date(data.ordered_at).setDate(
    new Date(data.ordered_at).getDate() + 7,
  );
  return (
    <div className="max-w-[70%] mx-auto flex justify-between gap-8 border-2 py-8 px-4 rounded-lg">
      <div>
        <div className="flex gap-4 items-center">
          <h2 className="text-[2rem] font-bold">{data.id}</h2>
          <div className="bg-green-200">
            {data.status === "PENDING"
              ? "未納品"
              : data.status === "DELIVERED"
                ? "納品完了"
                : "キャンセル済み"}
          </div>
        </div>
        <h3 className="text-[1.8rem] font-medium">仕入れ先企業名</h3>
        <div>
          <div className="flex gap-4">
            <p className="text-[1.25rem]">・{data.Product.product_name}</p>
            <p className="text-[1.25rem]">{data.quantity}個</p>
            <p className="text-[1.25rem]">仕入れ単価 {data.Product.price}円</p>
          </div>
        </div>
      </div>
      <div>
        <div className="text-right">
          <p className="text-[1.25rem]">合計金額</p>
          <p className="text-[2rem]">
            {data.Product.price ? `${data.Product.price * data.quantity}` : "0"}
            円
          </p>
        </div>

        <div>
          <div className="text-[1.25rem] flex gap-4">
            <p>発注日</p>
            {new Date(data.ordered_at).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </div>
          <div className="text-[1.25rem] flex gap-4">
            <p>予定日</p>
            {new Date(expectedDate).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </div>
          <div className="text-[1.25rem] flex gap-4">
            <p>納品日</p>
            {data.completed_at
              ? new Date(data.completed_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })
              : "未納品"}
          </div>
        </div>
      </div>

      <div className="my-auto">
        {/* モーダルメニュー */}
        <Dialog>
          {data.status === "PENDING" && (
            <>
              <DialogTrigger className="px-2 py-2 rounded-sm cursor-pointer text-white bg-[#2d2b2b]">
                入庫
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>入庫処理</DialogTitle>
                  <DialogDescription>
                    入庫した商品を確認してください
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div>
                    <p>{data.Product.product_name}</p>
                    <p>{data.quantity}</p>
                    <p>商品単価</p>
                    <p>合計金額</p>
                  </div>

                  <Button onClick={() => handleReceive(data.id)}>入庫</Button>
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default OrderCard;
