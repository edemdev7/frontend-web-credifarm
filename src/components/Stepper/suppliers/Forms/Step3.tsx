import { Checkbox } from "@heroui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateSupplier } from "../../../../api/services/supplierService";
import useSuppliersStepStore from "../../../../store/suppliersStepStore";
import { useSupplierStore } from "../../../../store/supplierStore";
import { Step3FormDataS } from "../../../types/form";
import Buttons from "./Buttons";

const Step3 = () => {
  const [buttonClicked, setButtonClicked] = useState<
    "save" | "next" | undefined
  >();
  const { setFormData, markStepAsCompleted, formData } =
    useSuppliersStepStore();
  const { selectedSupplier } = useSupplierStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Step3FormDataS>({
    defaultValues: formData.step3 || {
      verified: false,
    },
  });

  const onSubmit: SubmitHandler<Step3FormDataS> = async (data) => {
    console.log(data);
    setFormData(3, data);
    let response;

    if (selectedSupplier?.id && selectedSupplier?.type) {
      response = await updateSupplier(
        selectedSupplier.id,
        { masterStatus: data.verified ? "VERIFIE" : "EN_ATTENTE" },
        { type: selectedSupplier.type }
      );
    }
    console.log(response);
    markStepAsCompleted(3);
    toast.success("Fournisseur validé avec succès");
    navigate(0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
      {/* verified */}
      <Controller
        name="verified"
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
            Fournisseur vérifié ?
          </Checkbox>
        )}
      />

      {/* Buttons */}
      <Buttons
        reset={() => reset()}
        canSave={false}
        setButtonClicked={setButtonClicked}
        isSubmitting={isSubmitting}
        buttonClicked={buttonClicked}
      />
    </form>
  );
};

export default Step3;
