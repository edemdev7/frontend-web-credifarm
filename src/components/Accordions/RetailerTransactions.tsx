import { Accordion, AccordionItem, Skeleton, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTransactions,
  ITransaction,
} from "../../api/services/transactionService";
import { useRetailerStore } from "../../store/retailersStore";
import { formatDate } from "../../utils/formatters";

const RetailerTransactions: React.FC = () => {
  const [retailerName, setRetailerName] = useState<string | undefined>(
    undefined
  );
  const { selectedRetailer } = useRetailerStore();
  const [transactions, setTransactions] = useState<ITransaction[] | undefined>(
    []
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailerTransactions = async () => {
      if (selectedRetailer) {
        try {
          setLoading(true);
          setTransactions([]);
          const response = await getTransactions({
            merchantId: selectedRetailer.id,
          });
          setTransactions(response.data as unknown as ITransaction[]);
          setRetailerName(selectedRetailer.displayName);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRetailerTransactions();
  }, [selectedRetailer]);

  return (
    <section className="z-0 flex flex-col relative justify-between gap-4 bg-content1 rounded-large shadow-small w-full">
      <Accordion className="!px-0 !mx-0" variant="splitted">
        <AccordionItem
          classNames={{
            title: "!px-0 !mx-0",
            base: "!border-none !shadow-none w-full",
          }}
          key="1"
          aria-label="Accordion 1"
          title={
            <span className="flex justify-start items-center gap-2">
              <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-yellow-600 ">
                <i className="fa-duotone fa-money-bill-transfer text-xs"></i>
              </div>
              <span className="text-sm">Transactions</span>
            </span>
          }
        >
          {!selectedRetailer ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <i className="fa-duotone fa-triangle-exclamation text-2xl text-orange-500"></i>

              <div className="p-4 text-center text-gray-500">
                Veuillez sélectionner un détaillant pour voir ses transactions
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                {retailerName ? (
                  <div className="text-xs line-clamp-1">
                    Transactions de{" "}
                    <span className="font-bold">{retailerName}</span>
                  </div>
                ) : (
                  <div className="text-xs line-clamp-1">
                    Aucune transaction disponible
                  </div>
                )}
              </div>
              <Tabs
                classNames={{
                  tab: "!text-xs font-semibold",
                }}
                variant="underlined"
              >
                <Tab
                  key="actives"
                  title={<span className="text-yellow-600">Actifs</span>}
                >
                  {loading || !transactions ? (
                    <div className="space-y-3">
                      {Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-3"
                          >
                            <Skeleton className="h-2 w-14 rounded-full" />
                            <Skeleton className="h-2 w-20 rounded-full" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <ul className="h-[300px] overflow-y-auto">
                      {transactions?.filter(
                        (transaction) => transaction.type === "PENDING"
                      ).length === 0 || !transactions ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <i className="fa-duotone fa-info-circle text-xl text-blue-500"></i>
                          <p className="text-sm text-gray-500">
                            Aucune transaction active
                          </p>
                        </div>
                      ) : (
                        transactions
                          ?.filter(
                            (transaction) => transaction.type === "PENDING"
                          )
                          .map((transaction, index) => (
                            <li
                              className="cursor-pointer"
                              onClick={() =>
                                navigate(`/transactions?q=${transaction.id}`)
                              }
                              key={index}
                            >
                              <div className="w-full flex justify-between p-3 rounded-sm text-xs bg-yellow-100">
                                <div className="text-left">
                                  {transaction.totalDue} FCFA
                                </div>
                                <div className="text-right">
                                  {formatDate(transaction.createdAt)}
                                </div>
                              </div>
                              {index < 9 && <hr />}
                            </li>
                          ))
                      )}
                    </ul>
                  )}
                </Tab>
                <Tab
                  key="closed"
                  title={<span className="text-green-600">Fermés</span>}
                >
                  {loading || !transactions ? (
                    <div className="space-y-3">
                      {Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-3"
                          >
                            <Skeleton className="h-2 w-14 rounded-full" />
                            <Skeleton className="h-2 w-20 rounded-full" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <ul className="h-[300px] overflow-y-auto">
                      {transactions?.filter(
                        (transaction) => transaction.type === "CLOSE"
                      ).length === 0 || !transactions ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <i className="fa-duotone fa-info-circle text-xl text-blue-500"></i>
                          <p className="text-sm text-gray-500">
                            Aucune transaction fermée
                          </p>
                        </div>
                      ) : (
                        transactions
                          ?.filter(
                            (transaction) => transaction.type === "CLOSE"
                          )
                          .map((transaction, index) => (
                            <li
                              className="cursor-pointer"
                              onClick={() =>
                                navigate(`/transactions?q=${transaction.id}`)
                              }
                              key={index}
                            >
                              <div className="w-full flex justify-between p-3 rounded-sm text-xs bg-green-100">
                                <div className="text-left">
                                  {transaction.totalDue} FCFA
                                </div>
                                <div className="text-right">
                                  {formatDate(transaction.createdAt)}
                                </div>
                              </div>
                              {index < 9 && <hr />}
                            </li>
                          ))
                      )}
                    </ul>
                  )}
                </Tab>
                <Tab
                  key="all"
                  title={<span className="text-blue-600">Tout</span>}
                >
                  {loading || !transactions ? (
                    <div className="space-y-3">
                      {Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-3"
                          >
                            <Skeleton className="h-2 w-14 rounded-full" />
                            <Skeleton className="h-2 w-20 rounded-full" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <ul className="h-[300px] overflow-y-auto">
                      {transactions?.length === 0 || !transactions ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <i className="fa-duotone fa-info-circle text-xl text-blue-500"></i>
                          <p className="text-sm text-gray-500">
                            Aucune transaction
                          </p>
                        </div>
                      ) : (
                        transactions?.map((transaction, index) => (
                          <li
                            className="cursor-pointer"
                            onClick={() =>
                              navigate(`/transactions?q=${transaction.id}`)
                            }
                            key={index}
                          >
                            <div
                              className={`w-full flex justify-between p-3 rounded-sm text-xs ${
                                transaction.type === "PENDING"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <div className="text-left">
                                {transaction.totalDue} FCFA
                              </div>
                              <div className="text-right">
                                {formatDate(transaction.createdAt)}
                              </div>
                            </div>
                            {index < 9 && <hr />}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </Tab>
              </Tabs>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default RetailerTransactions;
