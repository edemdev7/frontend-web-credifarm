import { Skeleton } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { getAllSuppliers } from "../../api/services/supplierService";
import Card from "./Card";

const SupplierStats: FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    {
      title: "Fournisseurs",
      icon: "fa-users",
      number: 0,
      iconColor: "bg-blue-500",
    },
    {
      title: "En attente",
      icon: "fa-clock-desk",
      number: 0,
      iconColor: "bg-orange-500",
    },
    {
      title: "Vérifiés",
      icon: "fa-check",
      number: 0,
      iconColor: "bg-green-500",
    },
    {
      title: "Liste noire",
      icon: "fa-xmark",
      number: 0,
      iconColor: "bg-red-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAllSuppliers({ simplify: false });
      if (response) {
        // Récupérer les statistiques à partir des données
        const stats = response.data?.stats;
        const all = stats?.total ?? 0;
        const inWaiting = stats?.byStatus.EN_ATTENTE ?? 0;
        const verified = stats?.byStatus.VERIFIE ?? 0;
        const blackList = stats?.byStatus.LISTE_NOIRE ?? 0;

        // Mettre à jour les statistiques
        setStats((prevStats) => [
          { ...prevStats[0], number: all },
          { ...prevStats[1], number: inWaiting },
          { ...prevStats[2], number: verified },
          { ...prevStats[3], number: blackList },
        ]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
      {stats.map((stat) => (
        <li key={stat.title}>
          {loading ? (
            <div className="px-5 py-3 bg-white rounded-lg border border-default-200">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-24 h-3 rounded-lg" />
                </div>
              </div>
            </div>
          ) : (
            <Card {...stat} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default SupplierStats;
