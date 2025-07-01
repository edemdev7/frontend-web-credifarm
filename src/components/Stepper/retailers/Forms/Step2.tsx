import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateProspect } from "../../../../api/services/prospectService";
import useStepStore from "../../../../store/retailersStepStore";
import { Step2FormData } from "../../../types/form";
import Buttons from "./Buttons";

const Step2: FC = () => {
  const { setFormData, onNext, formData, markStepAsCompleted, prospectID } =
    useStepStore();

  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>();

  const onSubmit: SubmitHandler<Step2FormData> = async (data) => {
    try {
      const formattedData = {
        presentationMade: data.presentationMade === "yes",
        commentStep1: data.commentStep1,
        followUpDate1: data.followUpDate1
          ? new Date(data.followUpDate1).toISOString()
          : null,
        encounteredIssue: data.encounteredIssue ?? "",
        masterStatus: "EN_ATTENTE",
        stageStatus: "ETAPE_1",
        updateStep1: new Date().toISOString(),
        createStep1: new Date().toISOString(),
      };
      console.log("Données soumises:", formattedData);
      console.log("id :", prospectID);
      const response = await updateProspect(prospectID, formattedData);
      if (response.success) {
        console.log("Réponse:", response);
        // Sauvegarder les données dans le store
        setFormData(2, {
          presentationMade: data.presentationMade,
          encounteredIssue: data.encounteredIssue,
          followUpDate1: data.followUpDate1,
          commentStep1: data.commentStep1,
          masterStatus: data.masterStatus,
          stageStatus: data.stageStatus,
          updateStep1: formattedData.updateStep1,
          createStep1: formattedData.createStep1,
        });

        if (buttonClicked === "next") {
          onNext();
        } else if (buttonClicked === "save") {
          markStepAsCompleted(2);
        }
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {/* presentationMade */}
        <div>
          <div className="flex gap-3 items-center text-xs">
            <p className="font-semibold">Présentation faite ?</p>
            <label
              htmlFor="yes"
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                {...register("presentationMade", {
                  required: true,
                  value: formData.step2?.presentationMade,
                })}
                type="radio"
                value="yes"
                id="yes"
                className="outline-none scale-110 cursor-pointer"
              />
              <span>Oui</span>
            </label>
            <label
              htmlFor="no"
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                {...register("presentationMade", {
                  required: "Ce champ est requis",
                  value: formData.step2?.presentationMade,
                })}
                type="radio"
                value="no"
                id="no"
                className="outline-none scale-110 cursor-pointer"
              />
              <span>Non</span>
            </label>
          </div>
          {errors.presentationMade && (
            <span className="text-xs text-red-500">
              {errors.presentationMade.message}
            </span>
          )}
        </div>

        {/* encounteredIssue */}
        <Select
          {...register("encounteredIssue")}
          label="Problème rencontré"
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          <SelectItem key="invalidNumber" value="invalidNumber">
            Numéro invalide
          </SelectItem>
          <SelectItem key="notAvailable" value="notAvailable">
            Non disponible
          </SelectItem>
          <SelectItem key="other" value="other">
            Autre
          </SelectItem>
        </Select>

        {/* followUpDate1 */}
        <Input
          {...register("followUpDate1", {
            required:
              watch("presentationMade") === "no"
                ? "La date de relance est requise."
                : false,
          })}
          label="Date de relance"
          type="date"
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.followUpDate1}
          errorMessage={errors.followUpDate1?.message}
        />

        <Textarea
          {...register("commentStep1")}
          classNames={{
            input: "!text-xs",
            label: "!text-xs font-semibold",
          }}
          label="Commentaire"
          maxRows={3}
        />
      </div>

      <Buttons
        reset={reset}
        canSave={true}
        isSubmitting={isSubmitting}
        setButtonClicked={setButtonClicked}
        buttonClicked={buttonClicked}
      />
    </form>
  );
};

export default Step2;
