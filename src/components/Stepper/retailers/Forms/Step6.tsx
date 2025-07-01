import { Button, Chip, Divider } from "@heroui/react";
import { FC } from "react";
import useStepStore from "../../../../store/retailersStepStore";

const Step6: FC = () => {
  const { formData, onNext, isLastStep } = useStepStore();

  // Calcul de la limite recommandée
  const recommendedLimit =
    formData.step3?.refuelingFrequency && formData.step3?.averageAmount
      ? Math.ceil(
          (Number(formData.step3.refuelingFrequency) *
            Number(formData.step3.averageAmount) *
            (1 / 4.345) *
            0.3) /
            10000
        ) * 10000
      : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Danaya</span>
          <Chip color="success" size="sm">
            Approuvé
          </Chip>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">
            Fréquence de ravitaillement
          </span>
          <span className="text-xs">
            {formData.step3?.refuelingFrequency} fois/mois
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Montant moyen</span>
          <span className="text-xs">
            {formData.step3?.averageAmount?.toLocaleString()} FCFA
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">Limite recommandée</span>
          <Chip color="primary" size="sm">
            {recommendedLimit?.toLocaleString()} FCFA
          </Chip>
        </div>

        <Divider />

        <div className="space-y-2">
          <p className="text-xs font-semibold">Commentaires</p>
          <p className="text-xs text-default-500">
            {formData.step3?.commentStep2 || "Aucun commentaire"}
          </p>
        </div>
      </div>

      {/* Bouton de soumission */}
      <Button fullWidth color="primary" variant="shadow" onClick={onNext}>
        {isLastStep() ? "Terminer" : "Suivant"}
        <i className="fa fa-arrow-right ml-2"></i>
      </Button>
    </div>
  );
};

export default Step6;
