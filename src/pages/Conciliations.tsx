import { FC } from "react";
import { Helmet } from "react-helmet-async";
import ConciliationsList from "../components/Lists/ConciliationsList";
import SuggestionList from "../components/Lists/SuggestionList";

const Conciliations: FC = () => {

  return (
    <div>
      <Helmet>
        <title>Conciliations | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">CONCILIATIONS</h1>
        </div>

        <div>
          {/* Fournisseurs début */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-x-3 mt-5">
            <div className="col-span-2">
              <ConciliationsList />
            </div>
            <div className="col-span-1">
              <SuggestionList />
            </div>
          </section>
          {/* Fournisseurs fin */}
        </div>
      </main>
    </div>
  );
};

export default Conciliations;
