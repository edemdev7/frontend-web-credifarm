import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPromises } from "../../api/services/transactionService";
import { useTransactionStore } from "../../store/transactionStore";
import { capitalize, formatDate } from "../../utils/formatters";

interface PaymentPromisesProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface Transaction {
  id: number;
  merchant: {
    displayName: string;
    e164: string;
  };
}

export interface Payment {
  id: number;
  amount: number;
  promiseDate: string; // Peut être remplacé par Date si vous souhaitez manipuler directement l'objet Date en TypeScript
  transaction: Transaction;
  transactionId: number;
  clientDisplayName: string;
  clientE164: string;
}

const PaymentPromises: React.FC<PaymentPromisesProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [promises, setPromises] = useState<Payment[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showTodayOnly, setShowTodayOnly] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setSelectedTransaction } = useTransactionStore();
  useEffect(() => {
    const fetchPromises = async () => {
      const response = await getPromises();
      console.log(response.data);
      if (response.success) {
        setPromises(response.data as Payment[]);
      }
    };

    fetchPromises();
  }, []);

  const filteredPromises = promises?.filter((promise) => {
    const matchesSearchTerm =
      promise.transaction.id.toString().includes(searchTerm) ||
      promise.clientDisplayName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const isToday =
      format(new Date(promise.promiseDate), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd");
    return matchesSearchTerm && (!showTodayOnly || isToday);
  });

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!font-montserrat",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1 ~text-sm/base">
              Promesses de paiements
            </DrawerHeader>
            <DrawerBody>
              <div className="flex items-start gap-2">
                <Input
                  placeholder="Rechercher..."
                  description="ID Transaction, Nom du client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="bordered"
                  color="primary"
                  endContent={<i className="fa-solid fa-search"></i>}
                  classNames={{
                    input: "placeholder:!text-xs",
                  }}
                />
                <Button
                  variant={showTodayOnly ? "solid" : "bordered"}
                  color={showTodayOnly ? "primary" : "default"}
                  onPress={() => setShowTodayOnly(!showTodayOnly)}
                  radius="full"
                  size="sm"
                  className="text-xs px-4"
                >
                  Aujourd'hui
                </Button>
              </div>
              <Table
                removeWrapper
                aria-label="Liste des fournisseurs"
                selectionMode="single"
                classNames={{
                  th: "!h-[30px]",
                  thead: "!p-0 !m-0",
                }}
              >
                <TableHeader>
                  <TableColumn>
                    <p className="text-xs">ID</p>
                  </TableColumn>
                  <TableColumn>
                    <p className="text-xs">Client</p>
                  </TableColumn>
                  <TableColumn>
                    <p className="text-xs">Date</p>
                  </TableColumn>
                  <TableColumn>
                    <p className="text-xs">Montant</p>
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={
                    <div className="flex justify-center items-center ~text-xs/sm">
                      <p className="text-xs text-gray-400">
                        Aucune promesse de paiement
                      </p>
                    </div>
                  }
                >
                  {filteredPromises?.map((promise, _) => (
                    <TableRow
                      onClick={() => {
                        navigate(`/transactions?q=${promise.transaction.id}`);
                        onOpenChange(false);
                        setSelectedTransaction(null);
                      }}
                      className="cursor-pointer"
                      key={_}
                    >
                      <TableCell>
                        <p className="text-xs">TX{promise.transaction.id}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs line-clamp-1">
                          {capitalize(promise.clientDisplayName, true)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">
                          {formatDate(promise.promiseDate)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">
                          {promise.amount.toLocaleString()}F
                        </p>
                      </TableCell>
                    </TableRow>
                  )) || <></>}
                </TableBody>
              </Table>
            </DrawerBody>
            <DrawerFooter>
              <Button
                className=""
                size="sm"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Fermer
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PaymentPromises;
