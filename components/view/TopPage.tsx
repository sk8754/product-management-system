"use client";
import React, { useState } from "react";
import RectangleCard from "../ui/RectangleCard";
import RectangleGraphCard from "../ui/RectangleGraphCard";
import AllStoredItemsTable from "../ui/AllStoredItemsTable";
import { Stored } from "@/app/generated/prisma/client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCurrentStoredData } from "@/hooks/useCurrentStoredData";

export type storedDataProps = {
  storedData: Stored[];
};

const TopPage = ({ storedData }: storedDataProps) => {
  const { currentStoredData } = useCurrentStoredData(storedData);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [currentStored, setCurrentStored] = useState("");
  const [minimumStored, setMinimumStored] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();

  // 総在庫数の計算
  const totalStoredItemsAmount = useMemo(() => {
    return currentStoredData.reduce(
      (sum, data) => sum + data.current_stored,
      0,
    );
  }, [currentStoredData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/create", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          category,
          currentStored,
          minimumStored,
          status,
        }),
      });

      const result = await res.json();

      if (res.status === 200) {
        setProductId("");
        setProductName("");
        setCategory("");
        setCurrentStored("");
        setMinimumStored("");
        setStatus("");
      }

      if (res.status === 401) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-8">
      <div className="grid grid-cols-4 gap-8 mb-12">
        <RectangleCard
          label="総在庫数"
          number={totalStoredItemsAmount}
          image=""
          text="前月比"
        />
        <RectangleCard
          label="商品種類"
          number={currentStoredData.length}
          image=""
          text="アクティブな商品"
        />
        <RectangleCard
          label="低在庫アラート"
          image=""
          number={
            currentStoredData.filter((data) => data.status === "caution").length
          }
          text="要発注確認"
        />
        <RectangleCard
          label="緊急対応"
          number={
            currentStoredData.filter((data) => data.status === "alert").length
          }
          image=""
          text="即座に発注必要"
        />
      </div>

      {/* グラフカード */}
      <div className="grid grid-cols-2 mb-12">
        <RectangleGraphCard
          label="在庫推移"
          text="過去6ヶ月の在庫・入出庫状況"
          graph=""
        />
        <RectangleGraphCard
          label="カテゴリー別在庫"
          text="商品カテゴリー別の在庫分布"
          graph=""
        />
      </div>

      {/* 在庫テーブル */}
      <AllStoredItemsTable />
    </div>
  );
};

export default TopPage;
