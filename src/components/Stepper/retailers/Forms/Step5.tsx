import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createClient,
  updateClient,
  updateProspect,
} from "../../../../api/services/prospectService";
import useStepStore from "../../../../store/retailersStepStore";
import { Step5FormData } from "../../../types/form";
import Buttons from "./Buttons";

const Step5: FC = () => {
  const { setFormData, formData, onNext, prospectID, clientID, setClientID } =
    useStepStore();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step5FormData>({
    defaultValues: formData?.step5 || {
      name: "",
      firstName: "",
      e164: "",
      birthDay: "",
      role: "",
      district: "",
      sex: "",
      paymentNumber: "",
      terminal: "",
      location: "",
      commentStep4: "",
      contactMethod: "",
      paymentMethod: "",
      masterStatus: "EN_ATTENTE",
      stageStatus: "ETAPE_4",
      maritalStatus: "",
      education: "",
      gender: "",
    },
  });
  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();

  const onSubmit: SubmitHandler<Step5FormData> = async (data) => {
    try {
      const clientData = {
        firstName: data.firstName,
        name: data.name,
        e164: data.e164,
        district: data.district,
        role: "MERCHANT",
        contactMethod: data.contactMethod,
        paymentMethod: data.paymentMethod,
        paymentNumber: data.paymentNumber,
        prospectId: prospectID,
        birthDay: new Date(data.birthDay).toISOString(),
        maritalStatus: data.maritalStatus,
        education: data.education,
        gender: data.gender,
        updateStep4: new Date().toISOString(),
        createStep4: new Date().toISOString(),
      };

      const prospectData = {
        commentStep4: data.commentStep4,
        masterStatus: "EN_ATTENTE",
        stageStatus: "ETAPE_4",
        updateStep4: new Date().toISOString(),
        createStep4: new Date().toISOString(),
      };
      console.log("Données soumises:", data);

      setFormData(5, {
        ...clientData,
        ...prospectData,
        birthDay: data.birthDay,
        sex: data.sex,
        terminal: data.terminal,
        location: data.location,
        prospectId: prospectID,
        childrenCount: data.childrenCount,
        updateStep4: new Date().toISOString(),
        createStep4: new Date().toISOString(),
      });

      const responseP = await updateProspect(prospectID, prospectData);
      console.log("P :", responseP);
      if (responseP.success) {
        if (!clientID) {
          const responseC = await createClient(clientData);
          console.log("C :", responseC);
          if (responseC.success) {
            if ("id" in responseC.data) {
              if (responseC.data.id !== undefined) {
                setClientID(responseC.data.id);
              }
            }
            toast.success("Le client associé au prospect a été créé");
            if (buttonClicked === "next") onNext();
          } else {
            toast.error("Une erreur est survénue");
          }
        } else {
          const responseC = await updateClient(clientID, clientData);
          console.log("C :", responseC);
          if (responseC.success) {
            toast.success("Le client a été mis à jour");
          } else {
            toast.error("Une erreur est survénue");
          }
        }
      }
    } catch (error) {
      console.error("Erreur: ", error);
      toast.error("Une erreur est survénue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {/* Nom */}
        <Input
          {...register("name", { required: "Le nom est requis" })}
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
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />

        {/* Prénoms */}
        <Input
          {...register("firstName", { required: "Le prénom est requis" })}
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
          isInvalid={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />

        {/* Téléphone */}
        <Input
          {...register("e164", { required: "Le téléphone est requis" })}
          type="tel"
          label={
            <>
              Téléphone{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.e164}
          errorMessage={errors.e164?.message}
        />

        {/* Date de naissance */}
        <Input
          {...register("birthDay", {
            required: "La date de naissance est requise",
          })}
          type="date"
          label={
            <>
              Date de Naissance{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.birthDay}
          errorMessage={errors.birthDay?.message}
        />

        {/* Quartier */}
        <Input
          {...register("district", { required: "Le quartier est requis" })}
          label={
            <>
              Quartier{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.district}
          errorMessage={errors.district?.message}
        />

        {/* Sexe */}
        <Select
          {...register("sex", { required: "Le sexe est requis" })}
          label={
            <>
              Sexe{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          <SelectItem key="HOMME" value="HOMME">
            Homme
          </SelectItem>
          <SelectItem key="FEMME" value="FEMME">
            Femme
          </SelectItem>
        </Select>

        {/* Numéro de paiement */}
        <Input
          {...register("paymentNumber", {
            required: "Le numéro de paiement est requis",
          })}
          label={
            <>
              Numéro de paiement{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.paymentNumber}
          errorMessage={errors.paymentNumber?.message}
        />

        {/* Type de terminal */}
        <Select
          {...register("terminal")}
          label="Type de terminal"
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
        >
          <SelectItem key="ANDROID" value="ANDROID">
            Android
          </SelectItem>
          <SelectItem key="IPHONE" value="IPHONE">
            Iphone
          </SelectItem>
        </Select>

        {/* Géolocalisation */}
        <Input
          {...register("location", {
            required: "La géolocalisation est requise",
          })}
          label={
            <>
              Géolocalisation{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.location}
          errorMessage={errors.location?.message}
        />

        {/* maritalStatus */}
        <Select
          {...register("maritalStatus", {
            required: "Le statut matrimonial est requis.",
          })}
          label={
            <>
              Statut matrimonial{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          // value={maritalStatus}
          // onChange={(e) => setMaritalStatus(e.target.value)}
          isInvalid={!!errors.maritalStatus}
          errorMessage={errors.maritalStatus?.message}
        >
          <SelectItem key="marié" value="marié">
            Marié
          </SelectItem>
          <SelectItem key="célibataire" value="célibataire">
            Célibataire
          </SelectItem>
          <SelectItem key="concubinage" value="concubinage">
            Concubinage
          </SelectItem>
        </Select>
        {/* education */}
        <Select
          {...register("education", {
            required: "Le niveau d'éducation est requis.",
          })}
          label={
            <>
              Éducation{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          // value={education}
          // onChange={(e) => setEducation(e.target.value)}
          isInvalid={!!errors.education}
          errorMessage={errors.education?.message}
        >
          <SelectItem key="primaire" value="primaire">
            Primaire
          </SelectItem>
          <SelectItem key="secondaire" value="secondaire">
            Secondaire
          </SelectItem>
          <SelectItem key="supérieur" value="supérieur">
            Supérieur
          </SelectItem>
        </Select>
        {/* gender */}
        <Select
          {...register("gender", {
            required: "Le sexe est requis.",
          })}
          label={
            <>
              Sexe{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          // value={gender}
          // onChange={(e) => setGender(e.target.value)}
          isInvalid={!!errors.gender}
          errorMessage={errors.gender?.message}
        >
          <SelectItem key="Masculin" value="Masculin">
            Masculin
          </SelectItem>
          <SelectItem key="Feminin" value="Feminin">
            Feminin
          </SelectItem>
        </Select>
        {/* childrenCount */}
        <Input
          {...register("childrenCount", {
            required: "Le nombre d'enfants est requis.",
            pattern: {
              value: /^[0-9]+$/,
              message: "Le nombre d'enfants doit être un nombre entier.",
            },
          })}
          label={
            <>
              Nombre d'enfants{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          // value={childrenCount}
          // onChange={(e) => setChildrenCount(e.target.value)}
          isInvalid={!!errors.childrenCount}
          errorMessage={errors.childrenCount?.message}
        />

        {/* Commentaire */}
        <Textarea
          {...register("commentStep4")}
          label="Commentaire"
          classNames={{
            input: "!text-xs",
            label: "!text-xs font-semibold",
          }}
          maxRows={3}
        />
      </div>
      {/* Boutons de soumission */}
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

export default Step5;
