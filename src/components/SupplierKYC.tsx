import { Button, Input, Select, SelectItem, Tooltip } from "@heroui/react"; // Ajout de SelectItem
import { SubmitHandler, useForm } from "react-hook-form";
import InputFile from "./Lists/InputFile";
interface ProfileInfoFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  neighborhood: string;
  contactMethod: string;
  paymentMethod: string;
  paymentNumber: string;
  location: string;
  profile: File;
  identity: File;
}

const SupplierKYC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInfoFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      neighborhood: "",
      contactMethod: "",
      paymentMethod: "",
      paymentNumber: "",
      location: "",
    },
  });
  const onSubmit: SubmitHandler<ProfileInfoFields> = async (data) => {
    console.log(data);
  };
  return (
    (<div className="bg-content1 rounded-lg shadow-small justify-between px-4 py-4">
      <h1 className="flex justify-center items-center ~text-sm/base font-bold px-4 py-2 rounded-md">
        KYC du fournisseur
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
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
            required: "Les prénoms sont requis.",
            pattern: {
              value: /^[A-Za-zÀ-ÿ '-]+$/,
              message: "Les prénoms doivent contenir uniquement des lettres.",
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
        {/* email */}
        <Input
          {...register("email", {
            required: "L'email est requis.",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "L'email doit être valide.",
            },
          })}
          label={
            <>
              Email{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        {/* phone */}
        <Input
          {...register("phone", {
            required: "Le téléphone est requis.",
            pattern: {
              value: /^[0-9]+$/,
              message: "Le téléphone doit contenir uniquement des chiffres.",
            },
          })}
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
          isInvalid={!!errors.phone}
          errorMessage={errors.phone?.message}
        />
        {/* birthDate */}
        <Input
          {...register("birthDate", {
            required: "La date de naissance est requise.",
          })}
          label={
            <>
              Date de naissance{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          type="date"
          size="sm"
          classNames={{
            base: "w-full",
            label: "font-semibold !text-xs",
            input: "placeholder:!text-xs text-xs",
          }}
          isInvalid={!!errors.birthDate}
          errorMessage={errors.birthDate?.message}
        />
        {/* neighborhood */}
        <Input
          {...register("neighborhood", {
            required: "Le quartier est requis.",
          })}
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
          isInvalid={!!errors.neighborhood}
          errorMessage={errors.neighborhood?.message}
        />
        {/* contactMethod */}
        <Select
          {...register("contactMethod", {
            required: "La méthode de contact est requise.",
          })}
          label={
            <>
              Méthode de contact{" "}
              <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
            </>
          }
          size="sm"
          classNames={{
            listbox: "!font-[Montserrat] !text-xs",
            label: "font-semibold !text-xs",
            value: "!text-xs",
          }}
          isInvalid={!!errors.contactMethod}
          errorMessage={errors.contactMethod?.message}
        >
          <SelectItem key="email" value="email">
            Email
          </SelectItem>
          <SelectItem key="phone" value="phone">
            Téléphone
          </SelectItem>
        </Select>
        {/* paymentMethod */}
        <Select
          {...register("paymentMethod", {
            required: "Le mode de paiement est requis.",
          })}
          label={
            <>
              Mode de paiement{" "}
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
          <SelectItem key="mobileMoney" value="mobileMoney">
            Mobile Money
          </SelectItem>
          <SelectItem key="bankTransfer" value="bankTransfer">
            Virement bancaire
          </SelectItem>
        </Select>
        {/* paymentNumber */}
        <Input
          {...register("paymentNumber", {
            required: "Le numéro de paiement est requis.",
            pattern: {
              value: /^[0-9]+$/,
              message:
                "Le numéro de paiement doit contenir uniquement des chiffres.",
            },
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
        {/* location */}
        <Input
          {...register("location", {
            required: "La géolocalisation est requise.",
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
        {/* Pièce d'identité */}
        <InputFile
          {...register("identity", {
            required: "La pièce d'identité est requise.",
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
          label="Pièce d'identité"
        />
        {errors.identity && (
          <span className="text-xs text-red-500">
            {errors.identity.message}
          </span>
        )}
        {/* Buttons */}
        <div className="flex gap-2">
          <Tooltip
            showArrow
            color="default"
            content={
              <div className="flex gap-1">
                <b>Réinitialiser</b> les champs
              </div>
            }
          >
            <Button
              type="button"
              fullWidth
              color="primary"
              variant="shadow"
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
                <b>Enregistrer</b> le fournisseur
              </div>
            }
          >
            <Button
              type="submit"
              fullWidth
              color="default"
              isLoading={isSubmitting}
              variant="shadow"
              endContent={<i className="fa fa-save"></i>}
            >
              Enregistrer
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>)
  );
};

export default SupplierKYC;
