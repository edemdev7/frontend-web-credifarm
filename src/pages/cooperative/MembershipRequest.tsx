import { motion } from "framer-motion";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import MembershipRequestList from "../../components/Lists/MembershipRequestList";
import Details from "../../components/MembershipRequest/Details";
import { useMembershipRequestStore } from "../../store/membershipRequestnStore";

const CooperativeMembershipRequest: FC = () => {
  const { selectedMembershipRequest } = useMembershipRequestStore();

  return (
    <div>
      <Helmet>
        <title>Demandes d'adhesion | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">DEMANDES D'ADHESION</h1>
        </div>

        <div>
          {/* Fournisseurs début */}
            <section className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 lg:gap-x-3 mt-5">
            <div className="col-span-2 xl:col-span-2">
              <MembershipRequestList />
            </div>
            <div className="col-span-1 xl:col-span-2">
                <div className="blank-space" style={{ marginTop: '9em' }}></div>
                <style>{`
                @media (min-width: 80rem) {
                  .blank-space {
                  margin-top: 9em;
                  }
                }
                `}</style>
              {selectedMembershipRequest ? (
                <>
                  {/* Détails début */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <Details selectedMembershipRequest={selectedMembershipRequest} />
                  </motion.div>
                  {/* Détails fin */}

                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-info-circle text-4xl text-gray-400"></i>
                  <p className="text-gray-400 mt-2">
                    Aucune demande de crédit sélectionnée
                  </p>
                </div>
              )}
            </div>
          </section>
          {/* Fournisseurs fin */}
        </div>
      </main>
    </div>
  );
};

export default CooperativeMembershipRequest;
