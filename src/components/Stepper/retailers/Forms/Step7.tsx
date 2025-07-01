import { Button, Input } from "@heroui/react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  updateClient,
  updateProspect,
} from "../../../../api/services/prospectService";
import { useClientStore } from "../../../../store/clientStore";
import useStepStore from "../../../../store/retailersStepStore";
import { Step7FormData } from "../../../types/form";

const Step7: FC = () => {
  const {
    setFormData,
    markStepAsCompleted,
    isLastStep,
    formData,
    prospectID,
    clientID,
  } = useStepStore();

  const navigate = useNavigate();

  const { setSelectedClient } = useClientStore();
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step7FormData>({
    defaultValues: formData.step7 || {
      appInstalled: "",
      masterStatus: "VERIFIE",
      stageStatus: "ETAPE_6",
      recommendationLimit: recommendedLimit.toString(), // Ajout du champ limite recommandée
    },
  });

  const onSubmit: SubmitHandler<Step7FormData> = async (data) => {
    try {
      const formattedData = {
        ...data,
        appInstalled: data.appInstalled === "yes",
      };

      const prospectData = {
        masterStatus: formattedData.masterStatus,
        stageStatus: formattedData.stageStatus,
        updateStep6: new Date().toISOString(),
        createStep6: new Date().toISOString(),
      };
      const clientData = {
        appInstalled: formattedData.appInstalled,
        masterStatus: formattedData.masterStatus,
        stageStatus: formattedData.stageStatus,
        recommendationLimit: formattedData.recommendationLimit,
        updateStep6: new Date().toISOString(),
        createStep6: new Date().toISOString(),
      };

      console.log("Données soumises:", formattedData);

      const responseP = (await updateProspect(
        prospectID,
        prospectData
      )) as unknown as {
        success: boolean;
        data: {
          id: number;
          client: {
            name: string;
            firstName: string;
            displayName: string;
            birthDay: string;
            paymentNumber: string;
            paymentMethod: string;
            contactMethod: string;
            e164: string;
          };
          business: {
            id: number;
            businessType: string;
          };
          masterStatus: string;
        };
      };

      console.log("P :", responseP);
      if (responseP.success) {
        // Sauvegarder les données dans le store
        setFormData(7, data);
        markStepAsCompleted(7);
        const _selectedClient = {
          id: responseP.data.id.toString(),
          name: responseP.data.client.name,
          firstName: responseP.data.client.firstName,
          displayName: responseP.data.client.displayName,
          birthDay: responseP.data.client.birthDay,
          paymentNumber: responseP.data.client.paymentNumber,
          paymentMethod: responseP.data.client.paymentMethod,
          contactMethod: responseP.data.client.contactMethod,
          e164: responseP.data.client.e164,
          businessId: responseP.data.business.id,
          type: responseP.data.business.businessType,
          masterStatus: responseP.data.masterStatus,
        };
        setSelectedClient(_selectedClient);
        console.log(_selectedClient);

        const responseC = await updateClient(clientID, clientData);
        console.log(responseC);
        if (responseC.success) {
          toast.success("Fin du onboarding");
          navigate(0);
        }
      }
    } catch (error) {
      console.error("Erreur: ", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Application installée ? (radio) */}
        <div>
          <div className="flex gap-3 items-center text-xs">
            <p className="font-semibold">Application installée ?</p>
            <label
              htmlFor="yes"
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                {...register("appInstalled", {
                  required: "Ce champ est requis",
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
                {...register("appInstalled", {
                  required: "Ce champ est requis",
                })}
                type="radio"
                value="no"
                id="no"
                className="outline-none scale-110 cursor-pointer"
              />
              <span>Non</span>
            </label>
          </div>
          {errors.appInstalled && (
            <span className="text-xs text-red-500">
              {errors.appInstalled.message}
            </span>
          )}
        </div>

        {/* Limite recommandée */}
        <Input
          {...register("recommendationLimit", {
            required: "La limite recommandée est requise",
          })}
          label={
            <>
              Limite recommandée{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.recommendationLimit}
          errorMessage={errors.recommendationLimit?.message}
        />
      </div>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        fullWidth
        color="primary"
        variant="shadow"
        className="mt-5"
        isLoading={isSubmitting}
      >
        {isLastStep() ? "Terminer" : "Suivant"}
        <i
          className={`fa-solid ml-2 ${
            isLastStep() ? "fa-check-circle" : "fa-arrow-right"
          }`}
        ></i>
      </Button>
    </form>
  );
};

export default Step7;
