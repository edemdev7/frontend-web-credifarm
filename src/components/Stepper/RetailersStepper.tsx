import React from "react";
import Forms from "./retailers/Forms";
import RetailersSteps from "./RetailersSteps";

const RetailersStepper: React.FC = () => {
  return (
    <section className="p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large shadow-small w-full no-scrollbar overflow-y-auto">
      {/* Étapes */}
      <RetailersSteps />
      {/* Formulaire */}
      <Forms />
    </section>
  );
};

export default RetailersStepper;
