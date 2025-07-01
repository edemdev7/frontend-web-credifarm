import { Button } from "@heroui/react";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import SupplierTransactions from "../components/Accordions/SupplierTransactions";
import SuppliersList from "../components/Lists/SuppliersList";
import SupplierStats from "../components/Stats/SupplierStats";
import SuppliersStepper from "../components/Stepper/SuppliersStepper";
import SupplierInfos from "../components/SupplierInfos";
import { useSupplierStore } from "../store/supplierStore";

const Crm: FC = () => {
  const { selectedSupplier } = useSupplierStore();
  const navigate = useNavigate();
  return (
    <div>
      <Helmet>
        <title>Crm - Fournisseurs | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">
            crm - fournisseurs
          </h1>
          <Button
            variant="shadow"
            color="primary"
            size="sm"
            endContent={<i className="fa-regular fa-plus"></i>}
            onPress={() => {
              navigate(0);
            }} // Ajout de la méthode pour réinitialiser
          >
            Ajouter fournisseurs
          </Button>
        </div>

        <div>
          {/* Stats début */}
          <section>
            <SupplierStats />
          </section>
          {/* Stats fin */}

          {/* Fournisseurs début */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <div className="col-span-1">
              <SuppliersList />
            </div>
            <div className="col-span-1 lg:col-span-2">
              {selectedSupplier?.masterStatus === "VERIFIE" ? (
                <SupplierInfos />
              ) : (
                <SuppliersStepper />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <SupplierTransactions />
              </div>
            </div>
          </section>
          {/* Fournisseurs fin */}
        </div>
      </main>
    </div>
  );
};

export default Crm;
