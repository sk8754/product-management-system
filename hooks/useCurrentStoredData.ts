"use client";

import useSWR, { KeyedMutator } from "swr";
import { Stored } from "@/app/generated/prisma/client";

interface UseCurrentStoredData {
  currentStoredData: Stored[];
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<Stored[]>;
}

const fetcher = async (url: string): Promise<Stored[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export const useCurrentStoredData = (
  initialData?: Stored[],
): UseCurrentStoredData => {
  const { data, error, isLoading, mutate } = useSWR<Stored[]>(
    "/api/stored",
    fetcher,
    {
      fallbackData: initialData,
      refreshInterval: 30000,
    },
  );

  return {
    currentStoredData: data ?? [],
    isLoading,
    error,
    mutate,
  };
};
