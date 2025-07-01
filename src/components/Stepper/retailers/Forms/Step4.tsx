import { Select, SelectItem } from "@heroui/react";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { submitDanaya } from "../../../../api/services/prospectService";
import useStepStore from "../../../../store/retailersStepStore";
import InputFile from "../../../Lists/InputFile";
import { Step4FormData } from "../../../types/form";
import Buttons from "./Buttons";

const Step4: FC = () => {
  const { onNext, formData, setFormData, markStepAsCompleted, prospectID } =
    useStepStore();
  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step4FormData>({
    defaultValues: formData.step4 || {
      documentType: "",
      idDocumentFront: undefined,
      idDocumentBack: undefined,
      selfie: undefined,
    },
  });

  const onSubmit: SubmitHandler<Step4FormData> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Données soumises:", data);
      // Format the data before submitting
      const _formData = new FormData();
      _formData.append("prospectId", prospectID.toString());
      _formData.append("documentType", data.documentType);
      _formData.append(
        "idDocumentFront",
        data.idDocumentFront instanceof File
          ? data.idDocumentFront
          : data.idDocumentFront[0]
      );
      _formData.append(
        "idDocumentBack",
        data.idDocumentBack instanceof File
          ? data.idDocumentBack
          : data.idDocumentBack[0]
      );
      _formData.append(
        "selfie",
        data.selfie instanceof File ? data.selfie : data.selfie[0]
      );

      // Save to store and submit
      setFormData(4, {
        documentType: data.documentType,
        idDocumentFront: data.idDocumentFront,
        idDocumentBack: data.idDocumentBack,
        selfie: data.selfie,
        masterStatus: "EN_ATTENTE",
        stageStatus: "ETAPE_3",
        updateStep3: new Date().toISOString(),
        createStep3: new Date().toISOString(),
      });
      await submitDanaya(_formData).then((res) => {
        // En attendant que le backend soit corrigé
        console.log("Données récupérées", res);
        if (buttonClicked === "next") {
          onNext();
        } else if (buttonClicked === "save") {
          markStepAsCompleted(4);
        }
      });
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {/* Type de pièce (select) */}
        <Select
          {...register("documentType", {
            required: "Le type de pièce est requis.",
          })}
          label={
            <>
              Type de pièce{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.documentType}
          errorMessage={errors.documentType?.message}
        >
          <SelectItem key="CNI" value="CNI">
            CNI
          </SelectItem>
          <SelectItem key="PASSEPORT" value="PASSEPORT">
            Passeport
          </SelectItem>
          <SelectItem key="PERMIS_CONDUIRE" value="PERMIS_CONDUIRE">
            Permis de conduire
          </SelectItem>
          <SelectItem key="CARTE_CONSULAIRE" value="CARTE_CONSULAIRE">
            Carte consulaire
          </SelectItem>
          <SelectItem key="CARTE_RESIDENT" value="CARTE_RESIDENT">
            Carte résident
          </SelectItem>
        </Select>

        {/* Recto de la pièce */}
        <InputFile
          {...register("idDocumentFront", {
            required: "Le recto de la pièce est requis.",
            validate: {
              isImage: (value: File | FileList) => {
                const file = value instanceof FileList ? value[0] : value;
                const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                return (
                  !file ||
                  validTypes.includes(file?.type) ||
                  "Seuls les fichiers JPG, JPEG et PNG sont acceptés"
                );
              },
            },
          })}
          label="Recto de la pièce"
        />
        {errors.idDocumentFront && (
          <span className="text-xs text-red-500">
            {errors.idDocumentFront.message}
          </span>
        )}

        {/* Arrière de la pièce */}
        <InputFile
          {...register("idDocumentBack", {
            required: "Le verso de la pièce est requis.",
            validate: {
              isImage: (value: File | FileList) => {
                const file = value instanceof FileList ? value[0] : value;
                const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                return (
                  !file ||
                  validTypes.includes(file?.type) ||
                  "Seuls les fichiers JPG, JPEG et PNG sont acceptés"
                );
              },
            },
          })}
          label="Verso de la pièce"
        />
        {errors.idDocumentBack && (
          <span className="text-xs text-red-500">
            {errors.idDocumentBack.message}
          </span>
        )}

        {/* Photo du client */}
        <InputFile
          {...register("selfie", {
            required: "La photo du client est requise.",
            validate: {
              isImage: (value: File | FileList) => {
                const file = value instanceof FileList ? value[0] : value;
                const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                return (
                  !file ||
                  validTypes.includes(file?.type) ||
                  "Seuls les fichiers JPG, JPEG et PNG sont acceptés"
                );
              },
            },
          })}
          label="Photo du client"
        />
        {errors.selfie && (
          <span className="text-xs text-red-500">{errors.selfie.message}</span>
        )}
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

export default Step4;
