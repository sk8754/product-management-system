// RowOrderForm.tsx
"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button"; // あなたのボタンコンポーネント
import { Stored } from "@/app/generated/prisma/client";

type RowOrderFormProps = {
  row: Stored;
  onSubmit: (data: { quantity: number }, productId: string) => void;
};

export const RowOrderForm = ({ row, onSubmit }: RowOrderFormProps) => {
  // Zodスキーマ
  const orderSchema = z.object({
    quantity: z
      .number()
      .min(1, "1以上の数値を入力してください")
      .max(
        row.minimum_stored - row.current_stored >= 0
          ? row.minimum_stored - row.current_stored + 50
          : row.current_stored - row.minimum_stored + 20,
        "過剰な注文はできません",
      ),
  });

  type orderSchemaData = z.infer<typeof orderSchema>;

  // フォームの作成
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<orderSchemaData>({
    resolver: zodResolver(orderSchema),
  });

  const submitHandler = (data: orderSchemaData) => {
    onSubmit(data, row.product_id);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-2">
        <input
          type="number"
          placeholder="発注量"
          {...register("quantity", { valueAsNumber: true })}
          className="border px-2 py-1 rounded"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
      </div>
      <Button type="submit">発注</Button>
    </form>
  );
};
