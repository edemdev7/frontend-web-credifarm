import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  IDisbursement,
  processDisbursement,
} from "../../api/services/disbursementService";

interface PayOutAllProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  disbursements: IDisbursement[];
  fetchDisbursements: () => void;
}

const PayOutAll: React.FC<PayOutAllProps> = ({
  isOpen,
  onOpenChange,
  disbursements,
  fetchDisbursements,
}) => {
  const rowsPerPage = 10;
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<
    IDisbursement[]
  >([]);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [supplierId, setSupplierId] = useState<number>(0);
  const { isOpen: isConfirmOpen, onOpenChange: onConfirmOpenChange } =
    useDisclosure();
  const { isOpen: isTransactionsOpen, onOpenChange: onTransactionsOpenChange } =
    useDisclosure();

  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredDisbursements = [...disbursements];

    // On ne prend que les décaissements en attente
    filteredDisbursements = filteredDisbursements.filter(
      (disbursement) => disbursement.status === "PENDING"
    );

    if (hasSearchFilter) {
      filteredDisbursements = filteredDisbursements.filter((disbursement) =>
        disbursement.supplier.displayName
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    const supplierMap = filteredDisbursements.reduce(
      (acc: { [key: string]: number }, disbursement) => {
        if (!acc[disbursement.supplier.displayName]) {
          acc[disbursement.supplier.displayName] = 0;
        }
        acc[disbursement.supplier.displayName] +=
          disbursement.transaction.amount;
        return acc;
      },
      {}
    );

    return Object.keys(supplierMap).map((supplier) => ({
      supplier,
      amount: supplierMap[supplier],
    }));
  }, [hasSearchFilter, filterValue, disbursements]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          showControls
          boundaries={2}
          siblings={0}
          showShadow
          size="sm"
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            item: "bg-white",
            prev: "bg-white",
            next: "bg-white",
          }}
        />
      </div>
    );
  }, [page, pages, setPage]);

  const handleConfirm = () => {
    onConfirmOpenChange();
    console.log(selectedTransactions);
    const res = selectedTransactions.reduce(
      (acc, _transaction) => acc + _transaction.transaction.amount,
      0
    );
    setTotalSelectedAmount(res);
  };

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleRowClick = (supplier: string) => {
    setSelectedSupplier(supplier);
    const supplierTransactions = disbursements.filter(
      (disbursement) =>
        disbursement.supplier.displayName === supplier &&
        disbursement.status === "PENDING"
    );
    setSupplierId(supplierTransactions[0].supplier.id);
    setSelectedTransactions(supplierTransactions);
    setSelectedKeys(
      new Set(
        supplierTransactions.map((transaction) =>
          transaction.transaction.id.toString()
        )
      )
    ); // Mise à jour de selectedKeys
    onTransactionsOpenChange();
  };

  // Pour patcher le bug qui fait que l'event ne se déclenche pas sur mobile
  const handleRowTouch = (supplier: string) => {
    handleRowClick(supplier);
  };

  const handleTransactionSelection = (keys: Selection) => {
    const selected = disbursements.filter(
      (transaction) =>
        new Set(keys).has(transaction.transaction.id.toString()) &&
        transaction.status === "PENDING"
    );
    console.log(keys);
    console.log(selected);
    setSelectedKeys(keys);
    setSelectedTransactions(selected);
  };

  const transactions = useMemo(() => {
    return disbursements.filter(
      (disbursement) =>
        disbursement.supplier.displayName === selectedSupplier &&
        disbursement.status === "PENDING"
    );
  }, [selectedSupplier, disbursements]);

  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

  return (
    <>
      {/* Drawer de la liste des fournisseurs */}
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
                Déboursements en attente
              </DrawerHeader>
              <DrawerBody>
                <div className="flex justify-between gap-3 items-end mb-4">
                  <Input
                    isClearable
                    className="w-full"
                    placeholder="Rechercher..."
                    startContent={<i className="fa-regular fa-search"></i>}
                    value={filterValue}
                    variant="bordered"
                    color="primary"
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    classNames={{
                      input: "placeholder:!text-xs text-xs",
                    }}
                  />
                </div>
                <Table
                  removeWrapper
                  bottomContent={bottomContent}
                  aria-label="Liste des fournisseurs"
                  selectionMode="single"
                  classNames={{
                    th: "!h-[30px]",
                    thead: "!p-0 !m-0",
                  }}
                >
                  <TableHeader>
                    <TableColumn>
                      <p className="text-xs">Nom</p>
                    </TableColumn>
                    <TableColumn>
                      <p className="text-xs">Montant Total</p>
                    </TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={
                      <div className="flex justify-center items-center ~text-xs/sm">
                        <p className="text-xs text-gray-400">
                          Aucun déboursement en attente
                        </p>
                      </div>
                    }
                  >
                    {items.map((disbursement) => (
                      <TableRow
                        className="cursor-pointer"
                        key={disbursement.supplier}
                        onClick={() => handleRowClick(disbursement.supplier)}
                        onTouchEnd={() => handleRowTouch(disbursement.supplier)}
                      >
                        <TableCell>
                          <p className="text-xs">{disbursement.supplier}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">
                            {disbursement.amount.toLocaleString()} F
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
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

      {/* Modal de Confirmation */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        classNames={{
          base: "!font-montserrat",
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmation
              </ModalHeader>
              <ModalBody>
                <p className="~text-xs/sm">
                  Voulez-vous vraiment débourser toutes les transactions
                  sélectionnées ?
                </p>
                <div className="flex flex-col items-center">
                  <h2 className="~text-xs/sm">Montant total</h2>
                  <p className="~text-xl/3xl font-black">
                    {totalSelectedAmount.toLocaleString()} F
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className=""
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Annuler
                </Button>
                <Button
                  endContent={<i className="fa-solid fa-check-circle"></i>}
                  size="sm"
                  color="primary"
                  type="submit"
                  isLoading={isDisbursing}
                  onPress={async () => {
                    try {
                      setIsDisbursing(true);
                      const allTransactionIds = transactions.map(
                        (transaction) => transaction.transaction.id.toString()
                      );
                      const unselectedTransactionIds = allTransactionIds.filter(
                        (id) =>
                          selectedKeys instanceof Set && !selectedKeys.has(id)
                      );

                      // Ce sont les TXIDs dont dont on ne veut pas faire le déboursement
                      console.log(
                        "IDs non selectionnées :",
                        unselectedTransactionIds
                      );
                      console.log("Données envoyées :", {
                        supplierId: supplierId, // ID du fournisseur
                        txIds: unselectedTransactionIds, // IDs des transactions à ne pas débourser
                      });
                      const response = await processDisbursement({
                        supplierId: supplierId, // ID du fournisseur
                        txIds: unselectedTransactionIds, // IDs des transactions à ne pas débourser
                      });

                      console.log(response);
                      if (response.success) {
                        toast.success("Déboursement effectué avec succès");
                        onClose();
                        onTransactionsOpenChange();
                        onOpenChange(false);
                        fetchDisbursements();
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error("Une erreur est survenue !");
                    } finally {
                      setIsDisbursing(false);
                    }
                  }}
                >
                  Confirmer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Transactions du fournisseur */}
      <Modal
        scrollBehavior="inside"
        isOpen={isTransactionsOpen}
        onOpenChange={onTransactionsOpenChange}
        classNames={{
          base: "!font-montserrat",
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ~text-xs/sm">
                {selectedSupplier}
              </ModalHeader>
              <ModalBody>
                <Table
                  selectionMode="multiple"
                  removeWrapper
                  aria-label="Liste des transactions"
                  classNames={{
                    th: "!h-[30px]",
                    thead: "!p-0 !m-0",
                  }}
                  selectedKeys={selectedKeys}
                  onSelectionChange={handleTransactionSelection}
                >
                  <TableHeader>
                    <TableColumn>
                      <p className="text-xs">ID</p>
                    </TableColumn>
                    <TableColumn>
                      <p className="text-xs">Montant</p>
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.transaction.id}>
                        <TableCell>
                          <p className="text-xs">
                            TX{transaction.transaction.id}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">
                            {transaction.transaction.amount.toLocaleString()} F
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Fermer
                </Button>
                <Button
                  endContent={
                    <i className="fa-solid fa-hand-holding-dollar"></i>
                  }
                  size="sm"
                  color="primary"
                  type="submit"
                  onPress={handleConfirm}
                >
                  Débourser
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PayOutAll;
