import { Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createBusiness,
  getBusinessById,
  updateBusiness,
} from "../../../../api/services/businessService";
import useSuppliersStepStore from "../../../../store/suppliersStepStore";
import { useSupplierStore } from "../../../../store/supplierStore";
import { Step2FormDataS } from "../../../types/form";
import Buttons from "./Buttons";

const Step2: React.FC<{ withoutNext: boolean }> = ({ withoutNext }) => {
  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();
  const [showAlcoholicCheckbox, setShowAlcoholicCheckbox] = useState(false);
  const { selectedSupplier } = useSupplierStore();

  const { setFormData, onNext, formData } = useSuppliersStepStore();

  const [localVertical, setLocalVertical] = useState<string>("");
  const [localBusinessType, setLocalBusinessType] = useState<string>("");
  const [localRole, setLocalRole] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormDataS>({
    defaultValues: formData.step2 || {
      vertical: "",
      businessType: "",
      role: "",
      clientCount: "",
      reccuringClientCount: "",
      averageAmount: "",
      maxSaleCapacity: "",
      employeeCount: "",
      supplierCount: "",
      monthlyPurchaseValue: "",
      alcoholic: false,
      neighborhood: "",
      location: "",
    },
  });

  const onSubmit: SubmitHandler<Step2FormDataS> = async (data) => {
    try {
      console.log(data);
      setFormData(2, data);
      let response;
      console.log(selectedSupplier);
      if (selectedSupplier) {
        if (selectedSupplier.businessId) {
          response = await updateBusiness(selectedSupplier.businessId, data);
        } else {
          response = await createBusiness(selectedSupplier.id, data, {
            type: "client",
          });
        }
        console.log(response);
        if (response.success) {
          toast.success(response.message);
        }
        if (buttonClicked === "next" && response?.success) onNext();
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleVerticalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalVertical(value);
    setShowAlcoholicCheckbox(
      value === "boissonConsignee" || value === "boissonNonConsignee"
    );
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (selectedSupplier?.businessId) {
        const response = await getBusinessById(selectedSupplier.businessId);
        reset(response.data as unknown as Step2FormDataS);
        const businessData = response.data as unknown as Step2FormDataS;
        setLocalVertical(businessData.vertical || "");
        setLocalBusinessType(businessData.businessType || "");
        setLocalRole(businessData.role || "");
        console.log(response.data);
      }
    };

    fetchBusinessData();
  }, [reset, selectedSupplier?.businessId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
      {/* vertical */}
      <Controller
        name="vertical"
        control={control}
        rules={{
          required: "La verticale est requise.",
          onChange: handleVerticalChange,
        }}
        render={({ field }) => (
          <Select
            {...field}
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
            selectedKeys={new Set([localVertical])}
            onSelectionChange={(keys) =>
              setLocalVertical(Array.from(keys).join(""))
            }
            isInvalid={!!errors.vertical}
            errorMessage={errors.vertical?.message}
          >
            <SelectItem key="boissonConsignee" value="boissonConsignee">
              Boisson Consignée
            </SelectItem>
            <SelectItem key="boissonNonConsignee" value="boissonNonConsignee">
              Boisson Non-Consignée
            </SelectItem>
            <SelectItem key="gaz" value="gaz">
              Gaz
            </SelectItem>
            <SelectItem key="cosmetique" value="cosmetique">
              Cosmétique
            </SelectItem>
          </Select>
        )}
      />
      {/* alcoolise */}
      {showAlcoholicCheckbox && (
        <Controller
          name="alcoholic"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              value={field.value ? "true" : "false"}
              size="sm"
              classNames={{
                base: "w-full",
                label: "font-semibold !text-xs",
              }}
            >
              Alcoolisé ?
            </Checkbox>
          )}
        />
      )}
      {/* businessType */}
      <Controller
        name="businessType"
        control={control}
        rules={{
          required: "Le type de commerce est requis.",
        }}
        render={({ field }) => (
          <Select
            {...field}
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
            selectedKeys={new Set([localBusinessType])}
            onSelectionChange={(keys) =>
              setLocalBusinessType(Array.from(keys).join(""))
            }
            isInvalid={!!errors.businessType}
            errorMessage={errors.businessType?.message}
          >
            <SelectItem key="gros" value="gros">
              Gros
            </SelectItem>
            <SelectItem key="demiGros" value="demiGros">
              Demi-gros
            </SelectItem>
            <SelectItem key="depot" value="depot">
              Dépôt
            </SelectItem>
            <SelectItem key="sousDepot" value="sousDepot">
              Sous-dépôt
            </SelectItem>
            <SelectItem key="autre" value="autre">
              Autre
            </SelectItem>
          </Select>
        )}
      />
      {/* role */}
      <Controller
        name="role"
        control={control}
        rules={{
          required: "La fonction est requise.",
        }}
        render={({ field }) => (
          <Select
            {...field}
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
            selectedKeys={new Set([localRole])}
            onSelectionChange={(keys) =>
              setLocalRole(Array.from(keys).join(""))
            }
            isInvalid={!!errors.role}
            errorMessage={errors.role?.message}
          >
            <SelectItem key="proprietaire" value="proprietaire">
              Propriétaire
            </SelectItem>
            <SelectItem key="gerant" value="gerant">
              Gérant
            </SelectItem>
          </Select>
        )}
      />
      {/* clientCount */}
      <Controller
        name="clientCount"
        control={control}
        rules={{
          required: "Le nombre de clients est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le nombre de clients doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            label={
              <>
                Nombre de clients{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.clientCount}
            errorMessage={errors.clientCount?.message}
          />
        )}
      />
      {/* reccuringClientCount */}
      <Controller
        name="reccuringClientCount"
        control={control}
        rules={{
          required: "Le nombre de clients récurrents est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le nombre de clients récurrents doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            label={
              <>
                Nombre de clients récurrents{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.reccuringClientCount}
            errorMessage={errors.reccuringClientCount?.message}
          />
        )}
      />
      {/* averageAmount */}
      <Controller
        name="averageAmount"
        control={control}
        rules={{
          required: "Le panier moyen par vente est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le panier moyen par vente doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            step={1000}
            label={
              <>
                Panier moyen par vente{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.averageAmount}
            errorMessage={errors.averageAmount?.message}
          />
        )}
      />
      {/* maxSaleCapacity */}
      <Controller
        name="maxSaleCapacity"
        control={control}
        rules={{
          required: "Le montant maximum par vente est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le montant maximum par vente doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            step={1000}
            min={0}
            label={
              <>
                Montant maximum par vente{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.maxSaleCapacity}
            errorMessage={errors.maxSaleCapacity?.message}
          />
        )}
      />
      {/* employeeCount */}
      <Controller
        name="employeeCount"
        control={control}
        rules={{
          required: "Le nombre d'employés est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le nombre d'employés doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            label={
              <>
                Nombre d'employés{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.employeeCount}
            errorMessage={errors.employeeCount?.message}
          />
        )}
      />
      {/* supplierCount */}
      <Controller
        name="supplierCount"
        control={control}
        rules={{
          required: "Le nombre de fournisseurs est requis.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "Le nombre de fournisseurs doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            label={
              <>
                Nombre de fournisseurs{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.supplierCount}
            errorMessage={errors.supplierCount?.message}
          />
        )}
      />
      {/* monthlyPurchaseValue */}
      <Controller
        name="monthlyPurchaseValue"
        control={control}
        rules={{
          required: "La valeur totale des achats mensuels est requise.",
          pattern: {
            value: /^[0-9]+$/,
            message:
              "La valeur totale des achats mensuels doit contenir uniquement des chiffres.",
          },
          min: 0,
        }}
        render={({ field }) => (
          <Input
            {...field}
            min={0}
            step={1000}
            label={
              <>
                Valeur totale des achats mensuels{" "}
                <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
              </>
            }
            type="number"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.monthlyPurchaseValue}
            errorMessage={errors.monthlyPurchaseValue?.message}
          />
        )}
      />
      {/* neighborhood */}
      <Controller
        name="neighborhood"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Quartier"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.neighborhood}
            errorMessage={errors.neighborhood?.message}
          />
        )}
      />
      {/* location */}
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Géolocalisation"
            size="sm"
            classNames={{
              base: "w-full",
              label: "font-semibold !text-xs",
              input: "placeholder:!text-xs text-xs",
            }}
            isInvalid={!!errors.location}
            errorMessage={errors.location?.message}
          />
        )}
      />
      {/* Buttons */}
      <Buttons
        reset={() => reset()}
        canSave={true}
        setButtonClicked={setButtonClicked}
        isSubmitting={isSubmitting}
        buttonClicked={buttonClicked}
        withoutNext={withoutNext}
      />
    </form>
  );
};

export default Step2;
