import { Button } from "@heroui/react";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import RetailerTransactions from "../components/Accordions/RetailerTransactions";
import Activity from "../components/Activity";
import RetailersList from "../components/Lists/RetailersList";
import Loan from "../components/Loan";
import ProfileCard from "../components/ProfileCard";
import ProfileInfo from "../components/ProfileInfo";
import RetailersStats from "../components/Stats/RetailersStats";
import RetailersStepper from "../components/Stepper/RetailersStepper";
import { useClientStore } from "../store/clientStore";
import { useRetailerStore } from "../store/retailersStore";

const Crm: FC = () => {
  const { selectedClient } = useClientStore();
  const { selectedRetailer } = useRetailerStore();
  const navigate = useNavigate();
  return (
    <div>
      <Helmet>
        <title>Crm - Détaillants | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">
            crm - Détaillants
          </h1>
          <Button
            variant="shadow"
            color="primary"
            size="sm"
            endContent={<i className="fa-regular fa-plus"></i>}
            onPress={() => {
              navigate(0);
            }}
          >
            Ajouter détaillant
          </Button>
        </div>

        <div>
          {/* Stats début */}
          <section>
            <RetailersStats />
          </section>
          {/* Stats fin */}

          {/* Détaillants début */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <div className="col-span-1">
              <RetailersList />
            </div>
            <div className="col-span-1 lg:col-span-2">
              {selectedClient?.masterStatus ||
              selectedRetailer?.masterStatus === "VERIFIE" ? (
                <div className="space-y-3">
                  <ProfileCard />
                  <Activity />
                  <ProfileInfo />
                </div>
              ) : (
                <RetailersStepper />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Loan />
              <RetailerTransactions />
            </div>
          </section>
          {/* Détaillants fin */}
        </div>
      </main>
    </div>
  );
};

export default Crm;
