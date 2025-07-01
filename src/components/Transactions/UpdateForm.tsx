import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ITransaction,
  updateTransaction,
} from "../../api/services/transactionService";
import { useTransactionStore } from "../../store/transactionStore";

interface UpdateFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ isOpen, onOpenChange }) => {
  const { register, handleSubmit, setValue } = useForm<ITransaction>();
  const { selectedTransaction } = useTransactionStore();
  const [localCreatedAt, setLocalCreatedAt] = useState<string>();
  const [localMaturityDate, setLocalMaturityDate] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (selectedTransaction) {
      console.log(selectedTransaction);
      setValue("id", selectedTransaction.id);
      setValue("merchantDisplayName", selectedTransaction.merchantDisplayName);
      setValue("supplierDisplayName", selectedTransaction.supplierDisplayName);
      setValue("totalPrice", selectedTransaction.totalPrice);
      setValue("fee", selectedTransaction.fee);
      setValue("totalDue", selectedTransaction.totalDue);
      setValue("liquidityPocket", selectedTransaction.liquidityPocket);
      setValue("merchantPhone", selectedTransaction.merchantPhone);
      setLocalCreatedAt(
        selectedTransaction.createdAt
          ? new Date(selectedTransaction.createdAt).toISOString().split("T")[0]
          : ""
      );
      setLocalMaturityDate(
        selectedTransaction.maturityDate
          ? new Date(selectedTransaction.maturityDate)
              .toISOString()
              .split("T")[0]
          : ""
      );
    }
  }, [selectedTransaction, setValue]);

  const onSubmit: SubmitHandler<ITransaction> = async (data) => {
    console.log(data);
    try {
      setIsUpdating(true);
      const response = await updateTransaction(data.id, data);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!font-montserrat",
      }}
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1 ~text-xs/sm">
              Mettre à jour une transaction
            </ModalHeader>
            <ModalBody className="grid grid-cols-1 md:grid-cols-2">
              <Input
                {...register("id")}
                label="Transaction id"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("merchantDisplayName")}
                label="Nom du marchand"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("supplierDisplayName")}
                label="Nom du fournisseur"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("totalDue")}
                label="Total dû"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("totalPrice")}
                label="Achat total"
                fullWidth
                size="sm"
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />

              <Input
                {...register("createdAt")}
                label="Date de création"
                type="date"
                fullWidth
                size="sm"
                value={localCreatedAt}
                onChange={(e) => setLocalCreatedAt(e.target.value)}
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />

              <Input
                {...register("maturityDate")}
                label="Date d'échéance"
                type="date"
                fullWidth
                size="sm"
                value={localMaturityDate}
                onChange={(e) => setLocalMaturityDate(e.target.value)}
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("fee")}
                label="Frais de transaction"
                fullWidth
                size="sm"
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />

              <Input
                {...register("liquidityPocket")}
                label="Poche liquidité"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
              <Input
                {...register("merchantPhone")}
                label="Téléphone du marchand"
                fullWidth
                size="sm"
                readOnly
                isDisabled
                classNames={{
                  base: "w-full",
                  label: "font-semibold !text-xs",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className=""
                size="sm"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Fermer
              </Button>
              <Button
                isLoading={isUpdating}
                endContent={<i className="fa-solid fa-save"></i>}
                size="sm"
                color="primary"
                type="submit"
              >
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateForm;
