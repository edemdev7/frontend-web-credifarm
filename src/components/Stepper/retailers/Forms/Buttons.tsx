import { Button, Tooltip } from "@heroui/react";
import React, { Dispatch, SetStateAction } from "react";
import useStepStore from "../../../../store/suppliersStepStore";

interface ButtonsProps {
  reset: () => void;
  setButtonClicked: Dispatch<SetStateAction<"save" | "next" | undefined>>;
  buttonClicked: "save" | "next" | undefined;
  isSubmitting: boolean;
  canSave: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({
  reset,
  isSubmitting,
  canSave,
  setButtonClicked,
  buttonClicked,
}) => {
  const { isLastStep } = useStepStore();
  return (
    <div className="flex gap-2 mt-5">
      <Tooltip
        showArrow
        color="default"
        content={
          <div className="flex gap-1">
            <b>Réinitialiser</b> les champs du formulaire
          </div>
        }
      >
        <Button
          type="button"
          fullWidth
          color="primary"
          onClick={() => {
            reset();
          }}
          isIconOnly
        >
          <i className="fa-solid fa-rotate-left"></i>
        </Button>
      </Tooltip>
      <Tooltip
        showArrow
        color="default"
        content={
          <div className="flex gap-1">
            <b>Enregistrer</b> sans passer à l'étape suivante
          </div>
        }
      >
        <Button
          type="submit"
          fullWidth
          color="default"
          isDisabled={!canSave || (buttonClicked === "next" && isSubmitting)}
          isLoading={buttonClicked === "save" && isSubmitting}
          endContent={<i className="fa fa-save"></i>}
          onClick={() => {
            setButtonClicked("save");
          }}
        >
          Enregistrer
        </Button>
      </Tooltip>
      <Tooltip
        showArrow
        color="default"
        content={
          <div className="flex gap-1">
            <b>Enregistrer</b> et passer à l'étape suivante
          </div>
        }
      >
        <Button
          type="submit"
          fullWidth
          color="primary"
          isDisabled={isSubmitting && buttonClicked === "save"}
          isLoading={buttonClicked === "next" && isSubmitting}
          onClick={() => {
            setButtonClicked("next");
          }}
          endContent={<i className="fa fa-arrow-right"></i>}
        >
          {isLastStep() ? "Terminer" : "Suivant"}
        </Button>
      </Tooltip>
    </div>
  );
};

export default Buttons;
