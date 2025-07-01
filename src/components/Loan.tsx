import { Accordion, AccordionItem, Button, Tooltip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getMerchantBalance,
  getMerchantLimit,
  updateMerchantBalance,
  updateMerchantLimit,
} from "../api/services/prospectService";
import { useClientStore } from "../store/clientStore";
import { useRetailerStore } from "../store/retailersStore";

const Loan: React.FC = () => {
  const { selectedClient } = useClientStore();
  const { selectedRetailer } = useRetailerStore();
  const suggestion = "150000";
  const temp = false;

  // states
  const [merchantLimit, setMerchantLimit] = useState<string>("");
  const [merchantBalance, setMerchantBalance] = useState<string>("");
  const [isLimitLoading, setIsLimitLoading] = useState<boolean>(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);

  const formatNumber = (value: string | number) => {
    const stringValue = value.toString();
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  useEffect(() => {
    if (selectedRetailer) {
      const fetchMerchantData = async () => {
        try {
          const limitResponse = await getMerchantLimit(selectedRetailer.id);
          const balanceResponse = await getMerchantBalance(selectedRetailer.id);
          if (limitResponse.data && "limit" in limitResponse.data) {
            setMerchantLimit(limitResponse.data.limit as string);
          }
          if (balanceResponse.data && "balance" in balanceResponse.data) {
            setMerchantBalance(balanceResponse.data.balance as string);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données du marchand",
            error
          );
        }
      };
      fetchMerchantData();
    }
  }, [selectedRetailer]);

  const handleLimitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRetailer) {
      setIsLimitLoading(true);
      try {
        const response = await updateMerchantLimit(selectedRetailer.id, {
          limit: parseInt(merchantLimit, 10),
        });
        console.log(response);
        if (response.success) {
          toast.success("Limite mise à jour avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la limite", error);
        toast.error("Erreur lors de la mise à jour de la limite");
      } finally {
        setIsLimitLoading(false);
      }
    }
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRetailer) {
      setIsBalanceLoading(true);
      try {
        const response = await updateMerchantBalance(selectedRetailer.id, {
          balance: parseInt(merchantBalance, 10),
        });
        console.log(response);
        if (response.success) {
          toast.success("Solde mis à jour avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du solde", error);
        toast.error("Erreur lors de la mise à jour du solde");
      } finally {
        setIsBalanceLoading(false);
      }
    }
  };

  return (
    <section className="z-0 flex flex-col relative justify-between gap-4 bg-content1 rounded-large shadow-small w-full ">
      <Accordion className="!px-0 !mx-0" variant="splitted">
        <AccordionItem
          classNames={{
            base: "!border-none !shadow-none w-full",
          }}
          key="1"
          aria-label="Accordion 1"
          title={
            <span className="flex justify-start items-center gap-2">
              <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-blue-600">
                <i className="fa-duotone fa-hands-holding-dollar text-xs"></i>
              </div>
              <span className="text-sm">Compte de prêt</span>
            </span>
          }
        >
          {!selectedClient ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <i className="fa-duotone fa-triangle-exclamation text-2xl text-orange-500"></i>

              <div className="p-4 text-center text-gray-500">
                Veuillez sélectionner un détaillant.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xs line-clamp-1">
                  <span className="font-bold"></span>
                  <span>
                    {selectedClient.displayName ? (
                      <>
                        Limite de{" "}
                        <span className="font-bold">
                          {selectedClient.displayName}
                        </span>
                      </>
                    ) : (
                      "Nom non spécifié"
                    )}
                  </span>
                </div>
              </div>
              <div className="text-xs flex justify-between items-center ">
                <span>Note de prêt</span>
                <span className="font-black">12.89</span>
              </div>

              <div className="bg-zinc-100 rounded-lg p-3">
                <div className="flex justify-between items-start text-xs">
                  <p className="line-clamp-1">Limite du marchand (FCFA) </p>
                </div>
                <div className="text-base font-black mt-2">
                  <form
                    onSubmit={handleLimitSubmit}
                    className="flex items-center gap-2"
                  >
                    <Tooltip
                      placement="left"
                      showArrow
                      classNames={{
                        content: "!text-[10px] !font-[Montserrat] !bg-white",
                      }}
                      content="Cliquez pour modifier"
                    >
                      <input
                        type="text"
                        value={formatNumber(merchantLimit)}
                        onChange={(e) =>
                          setMerchantLimit(e.target.value.replace(/\s/g, ""))
                        }
                        className="bg-slate-100 focus:outline-none w-full"
                      />
                    </Tooltip>
                    <Button
                      size="sm"
                      color="primary"
                      isIconOnly
                      type="submit"
                      isLoading={isLimitLoading}
                    >
                      <i className="fa-solid fa-check"></i>
                    </Button>
                  </form>
                </div>
              </div>

              <div className="bg-zinc-100 rounded-lg p-3">
                <div className="flex justify-between items-start text-xs">
                  <p className="line-clamp-1">Solde du marchand (FCFA)</p>
                </div>
                <div className="text-base font-black mt-2">
                  <form
                    onSubmit={handleBalanceSubmit}
                    className="flex items-center gap-2"
                  >
                    <Tooltip
                      placement="left"
                      showArrow
                      classNames={{
                        content: "!text-[10px] !font-[Montserrat] !bg-white",
                      }}
                      content="Cliquez pour modifier"
                    >
                      <input
                        type="text"
                        value={formatNumber(merchantBalance)}
                        onChange={(e) =>
                          setMerchantBalance(e.target.value.replace(/\s/g, ""))
                        }
                        className="bg-slate-100 focus:outline-none w-full"
                      />
                    </Tooltip>
                    <Button
                      size="sm"
                      color="primary"
                      isIconOnly
                      type="submit"
                      isLoading={isBalanceLoading}
                    >
                      <i className="fa-solid fa-check"></i>
                    </Button>
                  </form>
                </div>
              </div>

              {temp && (
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="flex justify-between items-center text-xs">
                    <p className="line-clamp-1">Suggestion</p>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="text-base font-black mt-2 flex items-center gap-2">
                    <div className="whitespace-nowrap">
                      {parseInt(suggestion).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      <span className="text-[10px] font-semibold">FCFA</span>
                    </div>
                    <Button
                      size="sm"
                      radius="md"
                      color="primary"
                      className="text-[10px]"
                    >
                      Valider
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Loan;
