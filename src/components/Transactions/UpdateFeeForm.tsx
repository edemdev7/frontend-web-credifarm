import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ITransaction,
  updateTransaction,
} from "../../api/services/transactionService";
import { useTransactionStore } from "../../store/transactionStore";

interface UpdateFeeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // fetchTransactions: () => void;
}

const UpdateFeeForm: React.FC<UpdateFeeFormProps> = ({
  isOpen,
  onOpenChange,
  // fetchTransactions,
}) => {
  const { register, handleSubmit, watch } = useForm<ITransaction>();
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const { selectedTransaction } = useTransactionStore();
  const watchedValue = watch("overdueFee");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: ITransaction) => {
    try {
      setUpdating(true);
      if (selectedTransaction?.id !== undefined) {
        const response = await updateTransaction(selectedTransaction.id, {
          overdueFee: data.overdueFee,
        });
        if (response.success) {
          console.log("Transaction mise à jour avec succès:", response);
          onOpenChange(false);
          // fetchTransactions();
          toast.success("Frais de retard mis à jour avec succès !");
          navigate(0);
        }
      } else {
        console.error("Erreur: ID de transaction non défini");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la transaction:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = () => {
    setIsStrikethrough(!!watchedValue);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!font-montserrat",
      }}
      size="sm"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Modifier frais de retard
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-3">
                <p>
                  <div className="text-xs">Frais de retard</div>
                  <div
                    className={`font-black text-xl ${
                      isStrikethrough ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {selectedTransaction?.overdueFee ?? 0} FCFA
                  </div>
                </p>
                <Input
                  {...register("overdueFee")}
                  label="Nouveau frais"
                  variant="bordered"
                  endContent={<span className="text-xs font-bold">/FCFA</span>}
                  step={1000}
                  min={0}
                  type="number"
                  fullWidth
                  size="sm"
                  color="primary"
                  onInput={handleInputChange}
                  classNames={{
                    base: "w-full",
                    label: "font-semibold !text-xs",
                    input: "!text-xs",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Annuler
              </Button>
              <Button
                endContent={<i className="fa-solid fa-save"></i>}
                size="sm"
                color="primary"
                type="submit"
                isLoading={updating}
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

export default UpdateFeeForm;
