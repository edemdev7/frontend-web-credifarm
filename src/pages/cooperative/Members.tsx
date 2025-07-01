import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import MemberList from "../../components/Lists/MemberList";
import Details from "../../components/Member/Details";
import { useMemberStore } from "../../store/memberStore";
import { useState } from 'react';

const CooperativeMembers: FC = () => {
  const { selectedMember } = useMemberStore();
  const [showModal, setShowModal] = useState(false);

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(false);
  };


  return (
    <div>
      <Helmet>
        <title>Membres | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">MEMBRES</h1>
          {/* <Button
            variant="shadow"
            color="primary"
            size="sm"
            endContent={<i className="fa-regular fa-plus"></i>}
            onPress={() => setShowModal(true)}
            >
            Ajouter un membre non identifié
          </Button>
            {showModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Ajouter un membre non identifié</h2>
              <form onSubmit={handleAddMember}>
                <div className="mb-3">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nom"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nom"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nom"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                <Button
                  variant="shadow"
                  color="default"
                  size="sm"
                  onPress={() => setShowModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="shadow"
                  color="primary"
                  size="sm"
                >
                  Ajouter
                </Button>
                </div>
              </form>
              </div>
            </motion.div>
            )} */}
        </div>

        <div>
          {/* Fournisseurs début */}
            <section className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 lg:gap-x-3 mt-5">
            <div className="col-span-2 xl:col-span-2">
              <MemberList />
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
              {selectedMember ? (
                <>
                  {/* Détails début */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <Details selectedMember={selectedMember} />
                  </motion.div>
                  {/* Détails fin */}

                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-info-circle text-4xl text-gray-400"></i>
                  <p className="text-gray-400 mt-2">
                    Aucun producteur sélectionnée
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

export default CooperativeMembers;
