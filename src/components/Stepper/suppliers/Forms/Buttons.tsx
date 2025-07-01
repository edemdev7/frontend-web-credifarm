import { Button, Tooltip } from "@heroui/react";
import React, { Dispatch, SetStateAction } from "react";
import useStepStore from "../../../../store/suppliersStepStore";

interface ButtonsProps {
  reset: () => void;
  setButtonClicked: Dispatch<SetStateAction<"save" | "next" | undefined>>;
  buttonClicked: "save" | "next" | undefined;
  isSubmitting: boolean;
  canSave: boolean;
  withoutNext?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({
  reset,
  isSubmitting,
  canSave,
  setButtonClicked,
  buttonClicked,
  withoutNext,
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
      <Button
        type="submit"
        fullWidth
        color="default"
        isDisabled={!canSave || (buttonClicked === "next" && isSubmitting)}
        isLoading={buttonClicked === "save" && isSubmitting}
        variant="shadow"
        endContent={<i className="fa fa-save"></i>}
        onClick={() => {
          setButtonClicked("save");
        }}
      >
        Enregistrer
      </Button>
      {!withoutNext && (
        <Button
          type="submit"
          fullWidth
          color="primary"
          variant="shadow"
          isDisabled={isSubmitting && buttonClicked === "save"}
          isLoading={buttonClicked === "next" && isSubmitting}
          onClick={() => {
            setButtonClicked("next");
          }}
          endContent={<i className="fa fa-arrow-right"></i>}
        >
          {isLastStep() ? "Terminer" : "Suivant"}
        </Button>
      )}
    </div>
  );
};

export default Buttons;
