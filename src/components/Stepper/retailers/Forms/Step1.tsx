import type { Selection } from "@heroui/react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createProspect } from "../../../../api/services/prospectService";
import { getAllSuppliers } from "../../../../api/services/supplierService";
import useStepStore from "../../../../store/retailersStepStore";
import { useRetailerStore } from "../../../../store/retailersStore";
import { ISupplier } from "../../../../store/supplierStore";
import { Step1FormData } from "../../../types/form";
import Buttons from "./Buttons";

const Step1: FC = () => {
  const [localRecommendedBy, setLocalRecommendedBy] = useState<Selection>(
    new Set([])
  );
  const { setProspectID, prospectID, onNext, formData, setFormData } =
    useStepStore();
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]); // Nouvel état pour les suppliers
  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();

  const { fetchRetailers } = useRetailerStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    defaultValues: formData.step1 || {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      recommendationType: "",
      recommendBy: "",
      commentStep0: "",
      masterStatus: "EN_ATTENTE",
      stageStatus: "ETAPE_0",
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getAllSuppliers();
        if ("results" in response.data) {
          setSuppliers(response.data.results as ISupplier[]);
        } else {
          console.error("Unexpected response format: ", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    setLocalRecommendedBy(
      new Set(formData.step1?.recommendBy ? [formData.step1.recommendBy] : [])
    );
  }, [formData.step1?.recommendBy]);

  const onSubmit: SubmitHandler<Step1FormData> = async (data) => {
    try {
      if (!prospectID) {
        const convertedRecommendBy = Array.from(localRecommendedBy).join();
        const formattedData = {
          ...data,
          recommendBy: convertedRecommendBy,
          updateStep0: new Date().toISOString(),
        };

        console.log("Données soumises:", formattedData);
        const response = await createProspect(formattedData);

        if (response.success) {
          console.log("Réponse:", response);
          if ("id" in response.data) {
            setProspectID(response.data.id as number);
          }
          console.log(buttonClicked);
          // Mise à jour de l'état global
          setFormData(1, {
            firstName: formattedData.firstName,
            lastName: formattedData.lastName,
            phoneNumber: formattedData.phoneNumber,
            recommendationType: formattedData.recommendationType,
            recommendBy: convertedRecommendBy,
            commentStep0: formattedData.commentStep0,
            updateStep0: formattedData.updateStep0,
            masterStatus: formattedData.masterStatus,
            stageStatus: formattedData.stageStatus,
          });
          fetchRetailers();
          toast.success("Début de l'onboarding 🚀");
        }
      }
      onNext();
    } catch (error) {
      console.error("Erreur: ", error);
      toast.error("une erreur est survénue !");
    } finally {
      setButtonClicked(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {/* firstName */}
        <Input
          {...register("firstName", {
            required: "Le nom est requis.",
            pattern: {
              value: /^[A-Za-zÀ-ÿ '-]+$/,
              message: "Le nom doit contenir uniquement des lettres.",
            },
          })}
          label={
            <>
              Nom <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />

        {/* lastName */}
        <Input
          {...register("lastName", {
            required: "Le prénom est requis.",
            pattern: {
              value: /^[A-Za-zÀ-ÿ '-]+$/,
              message:
                "Le ou les prénoms doivent contenir uniquement des lettres.",
            },
          })}
          label={
            <>
              Prénoms{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.lastName}
          errorMessage={errors.lastName?.message}
        />

        {/* phoneNumber */}
        <Input
          {...register("phoneNumber", {
            required: "Le numéro de téléphone est requis.",
          })}
          label={
            <>
              Téléphone (+225){" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.phoneNumber}
          errorMessage={errors.phoneNumber?.message}
        />

        {/* recommendationType */}
        <Select
          {...register("recommendationType", {
            required: "Le type de recommandation est requis.",
          })}
          label={
            <>
              Type de recommandation{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.recommendationType}
          errorMessage={errors.recommendationType?.message}
        >
          <SelectItem key="prospecting" value="prospecting">
            Prospection
          </SelectItem>
          <SelectItem key="supplier" value="supplier">
            Fournisseur
          </SelectItem>
          <SelectItem key="website" value="website">
            Sites internet
          </SelectItem>
          <SelectItem key="social" value="social">
            Réseaux sociaux
          </SelectItem>
          <SelectItem key="other" value="other">
            Autre
          </SelectItem>
        </Select>

        {/* recommendBy */}
        <Select
          label="Recommandé par"
          size="sm"
          selectedKeys={localRecommendedBy}
          onSelectionChange={(v) => {
            console.log(v);
            setLocalRecommendedBy(v);
          }}
          selectionMode="single"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          {suppliers.map((supplier) => {
            return (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            );
          })}
        </Select>

        {/* commentStep0 */}
        <Textarea
          {...register("commentStep0")}
          classNames={{
            input: "!text-xs",
            label: "!text-xs font-semibold",
          }}
          label="Commentaire"
          maxRows={3}
        />

        <Buttons
          reset={reset}
          canSave={false}
          isSubmitting={isSubmitting}
          buttonClicked={buttonClicked}
          setButtonClicked={setButtonClicked}
        />
      </div>
    </form>
  );
};

export default Step1;
