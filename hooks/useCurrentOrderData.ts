"use client";

import { Order } from "@/app/generated/prisma/client";
import { OrderWithRelations } from "@/lib/types/order";
import useSWR, { KeyedMutator } from "swr";

interface UseCurrentOrderData {
  currentOrderData: OrderWithRelations[];
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<OrderWithRelations[]>;
}

const fetcher = async (url: string): Promise<OrderWithRelations[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
export const useCurrentOrderData = (): UseCurrentOrderData => {
  const { data, error, isLoading, mutate } = useSWR<OrderWithRelations[]>(
    "/api/orders",
    fetcher,
    {
      refreshInterval: 30000,
    },
  );

  return {
    currentOrderData: data ?? [],
    isLoading,
    error,
    mutate,
  };
};
