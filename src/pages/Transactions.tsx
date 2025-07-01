import { Button, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import TransactionsList from "../components/Lists/TransactionsList";
import Actions from "../components/Transactions/Actions";
import Details from "../components/Transactions/Details";
import Negotiation from "../components/Transactions/Negotiation";
import PaymentPromises from "../components/Transactions/PaymentPromises";
import { useTransactionStore } from "../store/transactionStore";

const Transactions: FC = () => {
  // States
  const { selectedTransaction } = useTransactionStore();
  const {
    onOpen: onPaymentTOpen,
    onOpenChange: onPaymentTOpenChange,
    isOpen: isPaymentTOpen,
  } = useDisclosure();

  return (
    <div>
      <Helmet>
        <title>Transactions | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 ~px-3/10">
        <div className="flex justify-between items-center">
          <h1 className="~text-base/lg font-bold uppercase">Transactions</h1>
          <Button
            onPress={onPaymentTOpen}
            color="primary"
            size="sm"
            variant="shadow"
          >
            Promesses de paiement
          </Button>
        </div>

        <PaymentPromises
          onOpenChange={onPaymentTOpenChange}
          isOpen={isPaymentTOpen}
        />

        <div>
          {/* Fournisseurs début */}
          <section className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 lg:gap-x-3 mt-5">
            <div className="col-span-2 xl:col-span-3">
              <TransactionsList />
            </div>
            <div className="col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {selectedTransaction ? (
                <>
                  {/* Détails début */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <Details selectedTransaction={selectedTransaction} />
                  </motion.div>
                  {/* Détails fin */}

                  {/* Négociations début */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <Negotiation selectedTransaction={selectedTransaction} />
                  </motion.div>
                  {/* Négociations fin */}

                  {/* Actions début */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <Actions />
                  </motion.div>
                  {/* Actions fin */}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-info-circle text-4xl text-gray-400"></i>
                  <p className="text-gray-400 mt-2">
                    Aucune transaction sélectionnée
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

export default Transactions;
