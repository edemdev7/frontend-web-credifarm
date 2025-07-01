import React from "react";

interface CardProps {
  title: string;
  icon: string;
  number: number;
  iconColor: string;
}

const Card: React.FC<CardProps> = ({ title, icon, number, iconColor }) => {
  return (
    <div className="bg-content1 rounded-lg shadow-small flex justify-between items-center px-5 py-3">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 ${iconColor} h-8 w-8 flex items-center justify-center rounded-full`}
        >
          <i className={`fa-regular text-white ${icon} `}></i>
        </div>
        <h3 className="font-medium ~text-xs/sm">{title}</h3>
      </div>
      <span className="font-bold">{number}</span>
    </div>
  );
};

export default Card;
