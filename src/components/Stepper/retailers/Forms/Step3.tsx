import type { Selection } from "@heroui/react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createBusiness,
  updateBusiness,
} from "../../../../api/services/businessService";
import { updateProspect } from "../../../../api/services/prospectService";
import { getAllSuppliers } from "../../../../api/services/supplierService";
import useStepStore from "../../../../store/retailersStepStore";
import { ISupplier } from "../../../../store/supplierStore";
import { Step3FormData } from "../../../types/form";
import Buttons from "./Buttons";

const Step3: FC = () => {
  const {
    setFormData,
    onNext,
    formData,
    prospectID,
    businessID,
    setBusinessID,
    markStepAsCompleted,
  } = useStepStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step3FormData>({
    defaultValues: formData.step3 || {
      isConvinced: "",
      preferredName: "",
      waitingReason: "",
      blockingReason: "",
      followupDate2: "",
      businessType: "",
      vertical: "",
      function: "",
      segment: "",
      suppliers: [],
      masterStatus: "EN_ATTENTE",
      stageStatus: "ETAPE_2",
    },
  });

  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();
  const [localSuppliers, setLocalSuppliers] = useState<Selection>(new Set([]));
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getAllSuppliers();
        if ("results" in response.data)
          setSuppliers(response.data.results as ISupplier[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    setLocalSuppliers(new Set(formData.step3?.suppliers || []));
  }, [formData.step3?.suppliers]);

  const onSubmit: SubmitHandler<Step3FormData> = async (data) => {
    try {
      const formattedDataProspect = {
        isConvinced: data.isConvinced === "yes",
        preferredName: data.preferredName,
        waitingReason: data.waitingReason,
        blockingReason: data.blockingReason,
        masterStatus: data.masterStatus,
        stageStatus: data.stageStatus,
        ...(data.followupDate2 && {
          followupDate2: new Date(data.followupDate2).toISOString(),
        }),
        commentStep2: data.commentStep2,
        updateStep2: new Date().toISOString(),
        createStep2: new Date().toISOString(),
      };

      const formattedDataBusiness = {
        businessType: data.businessType,
        vertical: data.vertical,
        role: data.function,
        segment: data.segment,
        suppliers: Array.from(localSuppliers).map(Number),
        supplyFrequencyPerMonth: parseInt(data.refuelingFrequency),
        averageAmount: parseInt(data.averageAmount),
        businessForm: data.activityForm,
        paymentMethod: data.paymentMethod,
        supplierRelationshipDurationMonths: parseInt(
          data.supplierRelationshipDurationMonths
        ),
        updateStep2: new Date().toISOString(),
        createStep2: new Date().toISOString(),
      };

      console.log("Données soumises maj prospect:", formattedDataProspect);
      const responseP = await updateProspect(prospectID, formattedDataProspect);
      if (responseP.success) {
        console.log("Réponse creation du prospect :", responseP);
        setFormData(3, {
          ...data,
          suppliers: Array.from(localSuppliers).map(String),
        });

        if (businessID) {
          const responseB = await updateBusiness(
            businessID,
            formattedDataBusiness
          );
          console.log("Réponse de maj du business :", responseB);
          if (responseB.success) {
            toast.success("le business a bien été mis à jour");
          }
        } else {
          const responseB = await createBusiness(
            prospectID,
            formattedDataBusiness
          );
          console.log("Réponse creation du business :", responseB);
          if (responseB.success && "id" in responseB.data) {
            setBusinessID(responseB.data.id as number);
            toast.success("Création du business associé au prospect");
          }
        }
      } else {
        toast.error(
          "Une erreur est survénue pendant la mise à jour du prospect"
        );
      }

      if (buttonClicked === "next") {
        onNext();
      } else if (buttonClicked === "save") {
        markStepAsCompleted(3);
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {/* Client convaincu ? (radio) */}
        <div>
          <div className="flex gap-3 items-center text-xs">
            <p className="font-semibold">Client convaincu ?</p>
            <label
              htmlFor="yes"
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                {...register("isConvinced", {
                  required: "Ce champ est requis",
                  value: formData.step3?.isConvinced,
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
                {...register("isConvinced", {
                  required: "Ce champ est requis",
                  value: formData.step3?.isConvinced,
                })}
                type="radio"
                value="no"
                id="no"
                className="outline-none scale-110 cursor-pointer"
              />
              <span>Non</span>
            </label>
          </div>
          {errors.isConvinced && (
            <span className="text-xs text-red-500">
              {errors.isConvinced.message}
            </span>
          )}
        </div>

        {/* Nom d'usage (text) */}
        <Input
          {...register("preferredName", {
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
              message: "Le nom d'usage ne doit contenir que des lettres.",
            },
          })}
          label="Nom d'usage"
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.preferredName}
          errorMessage={errors.preferredName?.message}
        />

        {/* Raison de l'attente (select) */}
        <Select
          {...register("waitingReason")}
          label="Raison de l'attente"
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          <SelectItem key="thinkingTime" value="thinkingTime">
            Temps de réflexion
          </SelectItem>
          <SelectItem key="volatiliteBusiness" value="volatiliteBusiness">
            Volatilité du business
          </SelectItem>
          <SelectItem key="decrease" value="decrease">
            Activité en baisse
          </SelectItem>
          <SelectItem key="other" value="other">
            Autre engagement
          </SelectItem>
        </Select>

        {/* Raison de blocage (select) */}
        <Select
          {...register("blockingReason", {
            required:
              watch("isConvinced") === "no"
                ? "Pourquoi le client n'est pas convaincu ?"
                : false,
          })}
          label="Raison de blocage"
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          <SelectItem key="highCost" value="highCost">
            Frais trop élévé
          </SelectItem>
          <SelectItem key="shortDelay" value="shortDelay">
            Delai trop court
          </SelectItem>
          <SelectItem key="noUnderstand" value="noUnderstand">
            Ne comprends pas bien
          </SelectItem>
          <SelectItem key="neBenefit" value="neBenefit">
            Ne perçois pas le bénéfice
          </SelectItem>
        </Select>

        {/* Date de relance (date) */}
        <Input
          {...register("followupDate2")}
          label="Date de relance"
          type="date"
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
        />

        <h2 className="font-bold">Métier</h2>

        {/* Type de commerce (select) */}
        <Select
          {...register("businessType", {
            required: "Le type de commerce est requis.",
          })}
          label={
            <>
              Type de commerce{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.businessType}
          errorMessage={errors.businessType?.message}
        >
          <SelectItem key="formal" value="formal">
            Formel
          </SelectItem>
          <SelectItem key="informal" value="informal">
            Informel
          </SelectItem>
          <SelectItem key="semi-formal" value="semi-formal">
            Semi-formel
          </SelectItem>
        </Select>

        {/* Verticale (select) */}
        <Select
          {...register("vertical", {
            required: "Ce champs est requis.",
          })}
          label={
            <>
              Verticale{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.vertical}
          errorMessage={errors.vertical?.message}
        >
          <SelectItem key="beverage" value="beverage">
            Boisson
          </SelectItem>
          <SelectItem key="cosmetic" value="cosmetic">
            Cosmétique
          </SelectItem>
          <SelectItem key="gas" value="gas">
            Gaz
          </SelectItem>
        </Select>

        {/* Fonction (select) */}
        <Select
          {...register("function", { required: "La fonction est requise." })}
          label={
            <>
              Fonction{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.function}
          errorMessage={errors.function?.message}
        >
          <SelectItem key="proprietaire" value="proprietaire">
            Propriétaire
          </SelectItem>
          <SelectItem key="gerant" value="gerant">
            Gérant
          </SelectItem>
        </Select>

        {/* Segment (select) */}
        <Select
          {...register("segment", { required: "Le segment est requis." })}
          label={
            <>
              Segment{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.segment}
          errorMessage={errors.segment?.message}
        >
          <SelectItem key="topAccount" value="topAccount">
            Top account
          </SelectItem>
          <SelectItem key="hero" value="hero">
            Héro
          </SelectItem>
          <SelectItem key="builder" value="builder">
            Bâtisseur
          </SelectItem>
          <SelectItem key="pearl" value="pearl">
            Perle
          </SelectItem>
          <SelectItem key="stable" value="stable">
            Étable
          </SelectItem>
        </Select>

        {/* Fournisseurs (select) */}
        <Select
          {...register("suppliers", {
            required: "Les fournisseurs sont requis.",
          })}
          label={
            <>
              Fournisseurs{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          selectedKeys={localSuppliers}
          onSelectionChange={setLocalSuppliers}
          selectionMode="multiple"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.suppliers}
          errorMessage={errors.suppliers?.message}
        >
          {suppliers.map((supplier) => {
            return (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            );
          })}
        </Select>

        {/* Fréquence de ravitaillement (number) */}
        <Input
          {...register("refuelingFrequency", {
            required: "La fréquence de ravitaillement est requise.",
          })}
          label={
            <>
              Fréquence de ravitaillement{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          endContent={<span className="text-xs font-semibold">/mois</span>}
          size="sm"
          type="number"
          min={0}
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.refuelingFrequency}
          errorMessage={errors.refuelingFrequency?.message}
        />

        {/* Montant moyen (number) */}
        <Input
          {...register("averageAmount", { required: "Ce champ est requis." })}
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          endContent={<span className="text-xs font-semibold">fcfa</span>}
          type="number"
          min={0}
          step={1000}
          label={
            <>
              Montant moyen{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          isInvalid={!!errors.averageAmount}
          errorMessage={errors.averageAmount?.message}
        />

        {/* Forme d'activité (select) */}
        <Select
          {...register("activityForm", {
            required: "La forme de commerce est requise.",
          })}
          label={
            <>
              Forme d'activité{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.activityForm}
          errorMessage={errors.activityForm?.message}
        >
          <SelectItem key="formal" value="formal">
            Cave
          </SelectItem>
          <SelectItem key="bar" value="bar">
            Bar
          </SelectItem>
          <SelectItem key="maquis" value="maquis">
            Maquis
          </SelectItem>
          <SelectItem key="restaurant" value="restaurant">
            Restaurant
          </SelectItem>
          <SelectItem key="halfBig" value="halfBig">
            Demi-gros
          </SelectItem>
          <SelectItem key="other" value="other">
            Autre
          </SelectItem>
        </Select>

        {/* Méthode de paiement (select) */}
        <Select
          {...register("paymentMethod", {
            required: "La méthode de paiement est requise.",
          })}
          label={
            <>
              Méthode de paiement{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.paymentMethod}
          errorMessage={errors.paymentMethod?.message}
        >
          <SelectItem key="formal" value="formal">
            Orange Money
          </SelectItem>
          <SelectItem key="bar" value="bar">
            Wave
          </SelectItem>
          <SelectItem key="maquis" value="maquis">
            Transfert bancaire
          </SelectItem>
        </Select>

        {/* Durée relation fournisseur - marchand (number) */}
        <Input
          {...register("supplierRelationshipDurationMonths", {
            required: "Ce champ est requis.",
          })}
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          label={
            <>
              Relation fournisseur - marchand{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          type="number"
          min={0}
          endContent={<span className="text-xs font-semibold">/mois</span>}
          size="sm"
          isInvalid={!!errors.supplierRelationshipDurationMonths}
          errorMessage={errors.supplierRelationshipDurationMonths?.message}
        />

        {/* Commentaire (textarea) */}
        <Textarea
          {...register("commentStep2")}
          classNames={{
            input: "!text-xs",
            label: "!text-xs font-semibold",
          }}
          label="Commentaire"
          maxRows={3}
        />
      </div>
      {/* Boutons de soumission */}
      <Buttons
        reset={reset}
        canSave={true}
        isSubmitting={isSubmitting}
        buttonClicked={buttonClicked}
        setButtonClicked={setButtonClicked}
      />
    </form>
  );
};

export default Step3;
