import React from "react";
import Forms from "./suppliers/Forms";
import SuppliersSteps from "./SuppliersSteps";

const SuppliersStepper: React.FC = () => {
  return (
    <section className="p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large shadow-small w-full no-scrollbar overflow-y-auto">
      <h1 className="font-bold text-center text-base">KYC du fournisseur</h1>
      {/* Étapes */}
      <SuppliersSteps />
      {/* Formulaire */}
      <Forms />
    </section>
  );
};

export default SuppliersStepper;
