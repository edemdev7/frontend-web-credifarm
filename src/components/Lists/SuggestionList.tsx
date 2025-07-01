import { Button, Card, CardBody, Input } from "@heroui/react";
import { motion } from "framer-motion"; // Importer motion
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getRecommendationByTransaction,
  processConciliation,
} from "../../api/services/conciliationService";
import { ISuggestion, useSuggestionStore } from "../../store/suggestionStore";
import { formatDate } from "../../utils/formatters";

const SuggestionList = () => {
  const { suggestions, setSuggestions, conciliationData } =
    useSuggestionStore();
  const [query, setQuery] = useState<string>();

  const sortedSuggestions: ISuggestion[] = suggestions
    ? [...suggestions].sort((a, b) => b.score - a.score)
    : [];

  const handleConciliation = async (id: number) => {
    if (!conciliationData) {
      toast.error("Veuillez sélectionner un paiement pour continuer.");
      return;
    }
    try {
      const response = await processConciliation({
        ...conciliationData,
        referenceId: id,
      });
      if (response.success) {
        toast.success("Conciliation effectuée avec succès !");
      }
    } catch (error) {
      toast.error("Une erreur est survenue !");
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!query) {
      toast.error("Veuillez entrer un identifiant de transaction.");
      return;
    }
    try {
      const response = await getRecommendationByTransaction(Number(query));
      console.log(response);
      if (response.success) {
        setSuggestions(response.data as ISuggestion[]);
      } else {
        toast.error("Aucune transaction trouvée");
        setSuggestions(null);
      }
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la récupération des recommandations !"
      );
      console.error(error);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 w-full">
        <Input
          isClearable
          placeholder="Rechercher..."
          description="ID Transaction..."
          startContent={<i className="fa-regular fa-search"></i>}
          value={query}
          onValueChange={setQuery}
          onClear={handleClear}
          classNames={{
            base: "!bg-slate-100 w-full",
            inputWrapper: "!bg-white",
            input: "placeholder:!text-xs text-xs",
          }}
        />
        <Button isIconOnly color="primary" onPress={handleSearch}>
          <i className="fa-solid fa-search"></i>
        </Button>
      </div>
      <h1 className="font-bold">Liste des transactions</h1>
      <ul className="space-y-3 text-[10px]">
        {sortedSuggestions.length > 0 ? (
          sortedSuggestions.map((item, index) => (
            <motion.div
              key={item.id}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              initial={{ opacity: 0, y: 20 }}
            >
              <Card
                radius="sm"
                classNames={{
                  base: `w-full`,
                }}
              >
                <CardBody>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-black`}>
                      {item.id} - {item.score}
                    </span>
                    <Button
                      className="font-semibold text-white"
                      color="primary"
                      size="sm"
                      onPress={() => handleConciliation(item.id)}
                    >
                      Concilier
                    </Button>
                  </div>
                  <ul className="mt-3">
                    <li className="flex justify-between">
                      <span className="font-semibold">
                        Niveau de recommandations
                      </span>
                      <span>{item.score}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">Montant</span>
                      <span>{item.amount}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">Date</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">Numéro Client</span>
                      <span>{item.merchantE164}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">Nom du marchand</span>
                      <span>{item.merchantName}</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-5 text-xs">
            <i
              className={`fa-solid ${
                conciliationData
                  ? "fa-triangle-exclamation text-xl text-orange-400"
                  : "fa-info-circle text-xl text-blue-400"
              }`}
            ></i>
            <p className="text-gray-500 mt-2 text-center">
              {conciliationData
                ? "Aucune transaction associée au paiement. Veuillez effectuer une recherche."
                : "Veuillez sélectionner un paiement pour commencer."}
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default SuggestionList;
