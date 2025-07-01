import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createPromise,
  IPromise,
  ITransaction,
  updatePromise,
} from "../../api/services/transactionService";
import { useTransactionStore } from "../../store/transactionStore";
import { formatDate } from "../../utils/formatters";
import UpdateFeeForm from "./UpdateFeeForm";

interface NegotiationProps {
  selectedTransaction: ITransaction;
}

const Negotiation: React.FC<NegotiationProps> = ({ selectedTransaction }) => {
  const {
    isOpen: isUFeeOpen,
    onOpen: onUFeeOpen,
    onOpenChange: onUFeeOpenChange,
  } = useDisclosure();

  const { register, handleSubmit, reset } = useForm<IPromise>();
  const [isCreating, setIsCreating] = useState(false);
  const { fetchTransactions } = useTransactionStore();
  const [paymentPromises, setPaymentPromises] = useState<IPromise[]>(
    selectedTransaction.paymentPromises
  );
  const [isUpdatingSuccess, setIsUpdatingSuccess] = useState<number | null>(
    null
  );
  const [isUpdatingDanger, setIsUpdatingDanger] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IPromise> = async (data) => {
    try {
      setIsCreating(true);
      console.log(data);
      const response = await createPromise(selectedTransaction.id, {
        ...data,
        respected: undefined,
      });
      console.log(response);
      if (response.success) {
        toast.success("La promesse de paiement a bien été enregistrée !");
        fetchTransactions();
        setPaymentPromises([...paymentPromises, response.data as IPromise]);
      }
      reset();
    } catch (error) {
      console.error(
        "Erreur lors de la création de la promesse de paiement",
        error
      );
    } finally {
      setIsCreating(false);
    }
  };

  const onUpdatePromise = async (promiseId: number, respected: boolean) => {
    try {
      if (respected) {
        setIsUpdatingSuccess(promiseId);
      } else {
        setIsUpdatingDanger(promiseId);
      }
      const response = await updatePromise(promiseId, { respected });
      if (response.success) {
        toast.success(
          `La promesse de paiement a été marquée comme ${
            respected ? "respectée" : "non respectée"
          } !`
        );
        setPaymentPromises((prevPromises) =>
          prevPromises.map((promise) =>
            promise.id === promiseId ? { ...promise, respected } : promise
          )
        );
        fetchTransactions();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la promesse de paiement",
        error
      );
    } finally {
      if (respected) {
        setIsUpdatingSuccess(null);
      } else {
        setIsUpdatingDanger(null);
      }
    }
  };

  useEffect(() => {
    setPaymentPromises(selectedTransaction.paymentPromises);
  }, [selectedTransaction]);

  return (
    <Card className="w-full h-full">
      <CardBody>
        <h2 className="font-semibold flex items-center gap-2">
          <i className="fa-duotone fa-wallet"></i>
          <span>Négociation</span>
        </h2>
        <div className="flex flex-row gap-3 mt-2">
          <Button
            size="sm"
            variant="shadow"
            color="primary"
            endContent={<i className="fa-solid fa-pen-to-square"></i>}
            onPress={onUFeeOpen}
          >
            Modifier frais de retard
          </Button>
          <UpdateFeeForm isOpen={isUFeeOpen} onOpenChange={onUFeeOpenChange} />
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="text-xs">
        <div className="w-full">
          <p className="text-center w-full font-semibold">
            Enregistrer promesse de paiement
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2 mt-2 w-full">
              <Input
                variant="bordered"
                color="primary"
                size="sm"
                classNames={{
                  input: "!text-xs",
                }}
                type="date"
                {...register("promiseDate", { required: true })}
              />
              <Input
                type="number"
                variant="bordered"
                color="primary"
                size="sm"
                min={0}
                step={1000}
                endContent={<b className="text-[10px]"> /FCFA</b>}
                placeholder="Valeur"
                classNames={{
                  input: "placeholder:!text-xs !text-xs",
                }}
                {...register("amount", { required: true })}
              />
              <Button
                isIconOnly
                size="sm"
                color="primary"
                variant="shadow"
                type="submit"
                isDisabled={isCreating}
              >
                {isCreating ? (
                  <i className="fa-spinner-third fa-spin fa-duotone"></i>
                ) : (
                  <i className="fa-solid fa-save"></i>
                )}
              </Button>
            </div>
          </form>
          <div className="mt-4">
            <Table
              removeWrapper
              className="mt-2"
              aria-label="Liste des promesses de paiements"
              classNames={{
                th: "!h-[30px]",
                thead: "!p-0 !m-0",
              }}
            >
              <TableHeader>
                <TableColumn>
                  <p className="text-xs">Date</p>
                </TableColumn>
                <TableColumn>
                  <p className="text-xs">Montant</p>
                </TableColumn>
                <TableColumn align="center">
                  <p className="text-xs">Actions</p>
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Aucune promesse">
                {paymentPromises.map((transaction, i) => (
                  <TableRow
                    key={i}
                    className={`h-11 ${
                      transaction.respected === true
                        ? "bg-green-100"
                        : transaction.respected === false
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <TableCell>
                      <p className="text-xs">
                        {formatDate(transaction.promiseDate)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{transaction.amount}</p>
                    </TableCell>
                    <TableCell align="center" className="space-x-2">
                      <Tooltip
                        content={
                          <span className="!font-montserrat text-[10px]">
                            Marquer comme respectée
                          </span>
                        }
                        showArrow
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          color="success"
                          variant="shadow"
                          onPress={() => onUpdatePromise(transaction.id, true)}
                          isDisabled={isUpdatingSuccess === transaction.id}
                        >
                          {isUpdatingSuccess === transaction.id ? (
                            <i className="fa-spinner-third fa-spin fa-duotone text-white"></i>
                          ) : (
                            <i className="fa-solid fa-check text-white"></i>
                          )}
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content={
                          <span className="!font-montserrat text-[10px]">
                            Marquer comme non respectée
                          </span>
                        }
                        showArrow
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="shadow"
                          onPress={() => onUpdatePromise(transaction.id, false)}
                          isDisabled={isUpdatingDanger === transaction.id}
                        >
                          {isUpdatingDanger === transaction.id ? (
                            <i className="fa-spinner-third fa-spin fa-duotone text-white"></i>
                          ) : (
                            <i className="fa-solid fa-times text-white"></i>
                          )}
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Negotiation;
