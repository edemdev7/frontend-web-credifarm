import { Tab, Tabs } from "@heroui/react";
import Step1 from "./Stepper/suppliers/Forms/Step1";
import Step2 from "./Stepper/suppliers/Forms/Step2";

const SupplierInfos = () => {

  return (
    <div>
      {" "}
      <div className="bg-content1 rounded-lg shadow-small justify-between px-4 py-4">
        <h1 className="text-center ~text-sm/base font-bold px-4 py-2 rounded-md">
          Informations du fournisseur
        </h1>
        <Tabs
          classNames={{
            tab: "!text-xs",
          }}
          variant="underlined"
          aria-label="Options"
        >
          <Tab key="details" title="Détails">
            <Step1 withoutNext />
          </Tab>
          <Tab key="business" title="Métier">
            <Step2 withoutNext />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierInfos;
