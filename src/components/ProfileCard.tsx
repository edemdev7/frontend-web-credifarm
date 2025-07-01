import { Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import { getMerchant } from "../api/services/prospectService";
import { useClientStore } from "../store/clientStore";
interface IMerchant {
  id: number;
  name: string;
  firstName: string;
  displayName: string;
  e164: string;
  birthday: string | null;
  limit: number;
  createStep5: string; // Date au format ISO 8601
  createdAt: string; // Date au format ISO 8601
  recommendBy: string | null;
  lateTransactionsCount: number;
}

const ProfileCard = () => {
  const { selectedClient } = useClientStore();
  const [merchant, setMerchant] = useState<IMerchant | null>(null);
  console.log(selectedClient);

  useEffect(() => {
    try {
      const fetchLimit = async () => {
        if (selectedClient) {
          const response = await getMerchant(parseInt(selectedClient.id));
          if (response.success) {
            setMerchant(response.data as IMerchant);
          }
        }
      };
      fetchLimit();
    } catch (error) {
      console.error(error);
    }
  }, [selectedClient]);

  return (
    <div className="bg-content1 rounded-lg shadow-small justify-between px-4 py-4">
      <h1 className="flex justify-between items-center ~text-sm/base font-bold bg-gray-100 px-4 py-2 rounded-md">
        <span>
          {selectedClient
            ? `${selectedClient.firstName} ${selectedClient.name}`
            : "Nom non disponible"}
        </span>
        <Chip
          color={"success"}
          size="sm"
          classNames={{
            content: "uppercase !text-[10px] font-bold text-white",
          }}
        >
          VERIFIé
        </Chip>
      </h1>
      <div className="space-y-4 p-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Numéro</span>
          <span className="text-xs">{merchant?.e164}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Limite de prêt</span>
          <span className="text-xs">
            <b>{merchant?.limit.toLocaleString()}</b> FCFA
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Date d'Activation</span>
          <span className="text-xs">
            {merchant?.birthday
              ? new Date(merchant.birthday).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Recommandé par</span>
          <span className="text-xs">-</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Retards</span>
          <span className="text-xs">
            {merchant?.lateTransactionsCount} Jour(s)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
