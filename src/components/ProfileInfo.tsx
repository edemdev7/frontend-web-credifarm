import {
  Button,
  Input,
  Select,
  Selection,
  SelectItem,
  Tab,
  Tabs,
  Tooltip,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getBusinessById,
  updateBusiness,
} from "../api/services/businessService";
import { getAllSuppliers } from "../api/services/supplierService";
import { useClientStore } from "../store/clientStore";
import { ISupplier } from "../store/supplierStore";
interface ProfileInfoFields {
  firstName: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDay: string;
  adresse: string;
}

interface ProfileBusinessFields {
  id: number;
  businessType: string;
  vertical: string;
  role: string;
  clientCount: number | null;
  segment: string;
  supplyFrequencyPerMonth: number;
  averageAmount: number;
  businessForm: string;
  paymentMethod: string;
  location: string | null;
  neighborhood: string | null;
  supplierCount: number | null;
  averageBasket: number | null;
  reccuringClientCount: number | null;
  maxSaleCapacity: number | null;
  employeeCount: number | null;
  monthlyPurchaseValue: number | null;
  supplierRelationshipDurationMonths: number;
  prospectId: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  suppliers: string;
}

const ProfileInfo = () => {
  const { selectedClient } = useClientStore();
  const [localSuppliers, setLocalSuppliers] = useState<Selection>(new Set([]));
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInfoFields>({
    defaultValues: {
      firstName: "",
      name: "",
      email: "",
      phoneNumber: "",
      birthDay: "",
      adresse: "",
    },
  });

  const {
    register: registerB,
    handleSubmit: handleSubmitB,
    reset: resetB,
    setValue: setValueB,
    formState: { errors: errorsB, isSubmitting: isSubmittingB },
  } = useForm<ProfileBusinessFields>({});

  useEffect(() => {
    if (selectedClient) {
      setValue("firstName", selectedClient.firstName || "");
      setValue("name", selectedClient.name || "");
      setValue("email", selectedClient.e164 || "");
      setValue("phoneNumber", selectedClient.paymentNumber || "");
      setValue("birthDay", selectedClient.birthDay || "");
      setValue("adresse", selectedClient.activation || "");
    }
  }, [selectedClient, setValue]);

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
    if (selectedClient?.businessId) {
      const fetchBusiness = async () => {
        try {
          if (selectedClient.businessId !== undefined) {
            const response = await getBusinessById(selectedClient.businessId);
            const businessData = response.data as ProfileBusinessFields;
            console.log(businessData);
            setValueB("businessType", businessData.businessType);
            setValueB("vertical", businessData.vertical);
            setValueB("role", businessData.role);
            setValueB("segment", businessData.segment);
            setValueB(
              "supplyFrequencyPerMonth",
              businessData.supplyFrequencyPerMonth
            );
            setValueB("averageAmount", businessData.averageAmount);
            setValueB("businessForm", businessData.businessForm);
            setValueB("paymentMethod", businessData.paymentMethod);
            setValueB(
              "supplierRelationshipDurationMonths",
              businessData.supplierRelationshipDurationMonths
            );
            setLocalSuppliers(new Set(businessData.suppliers));
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations du métier: ",
            error
          );
        }
      };

      fetchBusiness();
    }
  }, [selectedClient, setValueB]);

  const onSubmit: SubmitHandler<ProfileInfoFields> = async (data) => {
    console.log(data);
  };

  const onSubmitB: SubmitHandler<ProfileBusinessFields> = async (data) => {
    try {
      console.log({
        ...data,
        suppliers: data.suppliers.split(",").map(Number),
      });
      if (selectedClient?.businessId) {
        const response = await updateBusiness(selectedClient.businessId, {
          ...data,
          suppliers: data.suppliers.split(",").map(Number),
        });
        toast.success(
          "Les informations du métier ont été mises à jour avec succès."
        );
        console.log(response);
      } else {
        toast.error(
          "Erreur lors de la mise à jour des informations du métier."
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des informations du métier.");
      console.error(error);
    }
  };

  return (
    <div>
      {" "}
      <div className="bg-content1 rounded-lg shadow-small justify-between px-4 py-4">
        <h1 className="flex justify-between items-center ~text-sm/base font-bold bg-gray-100 px-4 py-2 rounded-md">
          Informations du détaillant
        </h1>
        <Tabs
          classNames={{
            tab: "!text-xs",
          }}
          variant="underlined"
          aria-label="Options"
        >
          <Tab key="details" title="Détails">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                    Nom{" "}
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
              {/* name */}
              <Input
                {...register("name", {
                  required: "Le prénom est requis.",
                  pattern: {
                    value: /^[A-Za-zÀ-ÿ '-]+$/,
                    message: "Le prénom doit contenir uniquement des lettres.",
                  },
                })}
                label={
                  <>
                    Prénom{" "}
                    <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
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
              {/* email */}
              <Input
                {...register("email", {
                  required: "L'email est requis.",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                    message: "L'email n'est pas valide.",
                  },
                })}
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
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
              {/* phoneNumber */}
              <Input
                {...register("phoneNumber", {
                  required: "Le numéro de téléphone est requis.",
                  pattern: {
                    value: /^[0-9]+$/,
                    message:
                      "Le numéro de téléphone doit contenir uniquement des chiffres.",
                  },
                })}
                label={
                  <>
                    Numéro de téléphone{" "}
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
              {/* birthDay */}
              <Input
                {...register("birthDay", {
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
                isInvalid={!!errors.birthDay}
                errorMessage={errors.birthDay?.message}
              />
              {/* adresse */}
              <Input
                {...register("adresse", {
                  required: "L'adresse est requise.",
                })}
                label={
                  <>
                    Adresse{" "}
                    <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
                  </>
                }
                size="sm"
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
                isInvalid={!!errors.adresse}
                errorMessage={errors.adresse?.message}
              />

              {/* Buttons */}
              <div className="flex gap-2">
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
                    onPress={() => {
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
                      <b>Mettre à jour</b> les infos du détaillants
                    </div>
                  }
                >
                  <Button
                    type="submit"
                    fullWidth
                    color="default"
                    isLoading={isSubmitting}
                    endContent={<i className="fa fa-save"></i>}
                  >
                    Mettre à jour
                  </Button>
                </Tooltip>
              </div>
            </form>
          </Tab>
          <Tab key="business" title="Métier">
            <form onSubmit={handleSubmitB(onSubmitB)} className="space-y-3">
              {/* Type de commerce (select) */}
              <Select
                {...registerB("businessType", {
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
                isInvalid={!!errorsB.businessType}
                errorMessage={errorsB.businessType?.message}
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
                {...registerB("vertical", {
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
                isInvalid={!!errorsB.vertical}
                errorMessage={errorsB.vertical?.message}
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
                {...registerB("role", {
                  required: "La fonction est requise.",
                })}
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
                isInvalid={!!errorsB.role}
                errorMessage={errorsB.role?.message}
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
                {...registerB("segment", {
                  required: "Le segment est requis.",
                })}
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
                isInvalid={!!errorsB.segment}
                errorMessage={errorsB.segment?.message}
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
                {...registerB("suppliers", {
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
                isInvalid={!!errorsB.suppliers}
                errorMessage={errorsB.suppliers?.message}
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
                {...registerB("supplyFrequencyPerMonth", {
                  required: "La fréquence de ravitaillement est requise.",
                })}
                label={
                  <>
                    Fréquence de ravitaillement{" "}
                    <i className="text-red-600 fa-solid fa-asterisk scale-50"></i>
                  </>
                }
                endContent={
                  <span className="text-xs font-semibold">/mois</span>
                }
                size="sm"
                type="number"
                min={0}
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
                isInvalid={!!errorsB.supplyFrequencyPerMonth}
                errorMessage={errorsB.supplyFrequencyPerMonth?.message}
              />

              {/* Montant moyen (number) */}
              <Input
                {...registerB("averageAmount", {
                  required: "Ce champ est requis.",
                })}
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
                isInvalid={!!errorsB.averageAmount}
                errorMessage={errorsB.averageAmount?.message}
              />

              {/* Forme d'activité (select) */}
              <Select
                {...registerB("businessForm", {
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
                isInvalid={!!errorsB.businessForm}
                errorMessage={errorsB.businessForm?.message}
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
                {...registerB("paymentMethod", {
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
                isInvalid={!!errorsB.paymentMethod}
                errorMessage={errorsB.paymentMethod?.message}
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
                {...registerB("supplierRelationshipDurationMonths", {
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
                endContent={
                  <span className="text-xs font-semibold">/mois</span>
                }
                size="sm"
                isInvalid={!!errorsB.supplierRelationshipDurationMonths}
                errorMessage={
                  errorsB.supplierRelationshipDurationMonths?.message
                }
              />
              {/* Buttons */}
              <div className="flex gap-2">
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
                      resetB();
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
                      <b>Mettre à jour</b> les infos du métier
                    </div>
                  }
                >
                  <Button
                    type="submit"
                    fullWidth
                    color="default"
                    isLoading={isSubmittingB}
                    endContent={<i className="fa fa-save"></i>}
                  >
                    Mettre à jour
                  </Button>
                </Tooltip>
              </div>
            </form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileInfo;
