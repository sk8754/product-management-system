// RowModal.tsx
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const orderSchema = z.object({
  quantity: z.number().min(1).max(200),
});
type OrderData = z.infer<typeof orderSchema>;

export const RowModal = ({ product }: { product: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = (data: OrderData) => {
    console.log(`${product.id} の注文: ${data.quantity}`);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger>発注</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>商品発注メニュー</DialogTitle>
          <DialogDescription>発注数量を入力してください</DialogDescription>
        </DialogHeader>
        <h2>商品名: {product.product_name}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity && <p>{errors.quantity.message}</p>}
          <Button type="submit">発注</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
