import { Input, Select, Selection, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createSupplier,
  updateSupplier,
} from "../../../../api/services/supplierService";
import useSuppliersStepStore from "../../../../store/suppliersStepStore";
import { ISupplier, useSupplierStore } from "../../../../store/supplierStore";
import { Step1FormDataS } from "../../../types/form";
import Buttons from "./Buttons";

const Step1: React.FC<{ withoutNext: boolean }> = ({ withoutNext }) => {
  const [localPaymentMethod, setLocalPaymentMethod] = useState<Selection>(
    new Set([])
  );
  const [localContactMethod, setLocalContactMethod] = useState<Selection>(
    new Set([])
  );
  const [localBirthDay, setLocalBirthDay] = useState<string>("");

  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();
  const { setFormData, onNext, formData } = useSuppliersStepStore();
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormDataS>({ defaultValues: formData.step1 });

  const onSubmit: SubmitHandler<Step1FormDataS> = async (data) => {
    try {
      console.log(data);
      setFormData(1, data);
      let response;
      console.log(selectedSupplier);
      if (selectedSupplier?.id) {
        response = await updateSupplier(
          selectedSupplier.id,
          { ...data, birthDay: localBirthDay },
          { type: selectedSupplier.type }
        );
      } else {
        response = await createSupplier({ ...data, birthDay: localBirthDay });
        console.log(response);
        setSelectedSupplier(response.data as ISupplier);
      }
      console.log(response);
      if (response.success) {
        toast.success(response.message);
      }
      if (buttonClicked === "next" && response?.success) onNext();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survénue");
    }
  };

  useEffect(() => {
    if (formData.step1) {
      reset({
        firstName: formData.step1.firstName || "",
        name: formData.step1.name || "",
        displayName: formData.step1.displayName || "",
        e164: formData.step1.e164 || "",
        birthDay: formData.step1.birthDay || "",
        contactMethod: formData.step1.contactMethod || "",
        paymentNumber: formData.step1.paymentNumber || "",
      });
      setLocalPaymentMethod(new Set([formData.step1.paymentMethod]));
      setLocalContactMethod(new Set([formData.step1.contactMethod]));
      setLocalBirthDay(
        formData.step1.birthDay
          ? new Date(formData.step1.birthDay).toISOString().split("T")[0]
          : ""
      );
    }
  }, [formData.step1, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
      {/* firstName */}
      <Controller
        name="firstName"
        control={control}
        rules={{
          pattern: {
            value: /^[A-Za-zÀ-ÿ '-]+$/,
            message: "Le nom doit contenir uniquement des lettres.",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Nom"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.firstName}
            errorMessage={errors.firstName?.message}
          />
        )}
      />
      {/* lastName */}
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{
          pattern: {
            value: /^[A-Za-zÀ-ÿ '-]+$/,
            message: "Les prénoms doivent contenir uniquement des lettres.",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Prénoms"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />
      {/* DisplayName */}
      <Controller
        name="displayName"
        control={control}
        defaultValue=""
        rules={{
          required: "Le display name est requis.",
        }}
        render={({ field }) => (
          <Input
            {...field}
            label={
              <>
                Display Name{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.displayName}
            errorMessage={errors.displayName?.message}
          />
        )}
      />
      {/* e164 */}
      <Controller
        name="e164"
        control={control}
        defaultValue=""
        rules={{
          required: "Le téléphone est requis.",
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Le téléphone doit contenir exactement 10 chiffres.",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
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
        )}
      />
      {/* birthDay */}
      <Controller
        name="birthDay"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Date de naissance"
            type="date"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            value={localBirthDay}
            onChange={(e) => setLocalBirthDay(e.target.value)}
            isInvalid={!!errors.birthDay}
            errorMessage={errors.birthDay?.message}
          />
        )}
      />
      {/* contactMethod */}
      <Controller
        name="contactMethod"
        control={control}
        defaultValue="email" // Valeur par défaut ajoutée
        rules={{
          required: "La méthode de contact est requise.",
        }}
        render={({ field }) => (
          <Select
            {...field}
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
            selectedKeys={localContactMethod}
            onSelectionChange={setLocalContactMethod}
            isInvalid={!!errors.contactMethod}
            errorMessage={errors.contactMethod?.message}
          >
            <SelectItem key="email" value="email">
              Email
            </SelectItem>
            <SelectItem key="phone" value="phone">
              Téléphone
            </SelectItem>
            <SelectItem key="contact" value="contact">
              Contact direct
            </SelectItem>
          </Select>
        )}
      />
      {/* paymentMethod */}
      <Controller
        name="paymentMethod"
        control={control}
        defaultValue=""
        rules={{
          required: "Le mode de paiement est requis.",
        }}
        render={({ field }) => (
          <Select
            {...field}
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
            selectedKeys={localPaymentMethod}
            onSelectionChange={setLocalPaymentMethod}
            isInvalid={!!errors.paymentMethod}
            errorMessage={errors.paymentMethod?.message}
          >
            <SelectItem key="mobile-money" value="mobile-money">
              Mobile Money
            </SelectItem>
            <SelectItem key="bank-transfer" value="bank-transfer">
              Virement bancaire
            </SelectItem>
            <SelectItem key="wave-transfer" value="wave-transfer">
              Wave
            </SelectItem>
          </Select>
        )}
      />
      {/* paymentNumber */}
      <Controller
        name="paymentNumber"
        control={control}
        defaultValue=""
        rules={{
          required: "Le numéro de paiement est requis.",
          pattern: {
            value: /^(CI\d{2}[A-Z0-9]{20}|[0-9]{10})$/,
            message:
              "Le numéro de paiement doit être un IBAN valide ou contenir exactement 10 chiffres.",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label={
              <>
                Numéro de paiement (Téléphone ou IBAN){" "}
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
        )}
      />
      {/* Boutons de soumission */}
      <Buttons
        reset={() =>
          reset({
            firstName: "",
            name: "",
            displayName: "",
            e164: "",
            birthDay: "",
            contactMethod: "",
            paymentMethod: "",
            paymentNumber: "",
          })
        }
        canSave={true}
        isSubmitting={isSubmitting}
        setButtonClicked={setButtonClicked}
        buttonClicked={buttonClicked}
        withoutNext={withoutNext}
      />
    </form>
  );
};

export default Step1;
