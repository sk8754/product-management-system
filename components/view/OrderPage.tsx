"use client";
import React from "react";
import OrderCard from "../ui/OrderCard";
import { useCurrentOrderData } from "@/hooks/useCurrentOrderData";

const OrderPage = () => {
  const { currentOrderData, isLoading, error, mutate } = useCurrentOrderData();
  return (
    <>
      <div>
        {isLoading && <div>Loading...</div>}
        {currentOrderData &&
          currentOrderData.map((data) => (
            <div key={data.id} className="mb-8">
              <OrderCard data={data} />
            </div>
          ))}
      </div>
    </>
  );
};

export default OrderPage;
