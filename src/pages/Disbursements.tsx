import { FC } from "react";
import { Helmet } from "react-helmet-async";
import DisbursementsList from "../components/Lists/DisbursementsList";

const Disbursements: FC = () => {

  return (
    <div>
      <Helmet>
        <title>Déboursements | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">Déboursements</h1>
        </div>

        <div>
          {/* Fournisseurs début */}
          <section className="mt-5">
            <DisbursementsList />
          </section>
          {/* Fournisseurs fin */}
        </div>
      </main>
    </div>
  );
};

export default Disbursements;
