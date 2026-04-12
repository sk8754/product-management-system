import React from "react";

export type RectangleGraphCard = {
  label: string;
  text: string;
  graph: string;
};

const RectangleGraphCard = ({ label, text, graph }: RectangleGraphCard) => {
  return (
    <>
      <div className="px-4 py-4">
        <h2 className="font-bold text-[1.2rem]">{label}</h2>
        <p>{text}</p>

        {/* グラフ */}
        <div>{graph}</div>
      </div>
    </>
  );
};

export default RectangleGraphCard;
