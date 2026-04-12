import React from "react";

export type RectangleCardProps = {
  label: string;
  number: number;
  image: string;
  text: string;
};

const RectangleCard = ({ label, number, image, text }: RectangleCardProps) => {
  return (
    <>
      <div className="py-8 px-4 border border-gray-400 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h2>{label}</h2>
          <img alt="アイコン" />
        </div>

        <p
          className={`font-bold text-[2.5rem] ${
            label === "低在庫アラート"
              ? "text-yellow-300"
              : label === "緊急対応"
              ? "text-red-400"
              : ""
          }`}
        >
          {number}
        </p>
        <p>{text}</p>
      </div>
    </>
  );
};

export default RectangleCard;
