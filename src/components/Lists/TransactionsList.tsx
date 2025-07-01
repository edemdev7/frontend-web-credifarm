import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  RangeValue,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import {
  FC,
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ITransaction } from "../../api/services/transactionService";
import { useTransactionStore } from "../../store/transactionStore";
import {
  capitalize,
  formatDate,
  formatTransactionStatus,
} from "../../utils/formatters";
import Invoice from "../Transactions/Invoice";
import PurchFilter from "../Transactions/PurchFilter";
import RepayFilter from "../Transactions/RepayFilter";

// Constantes
const rowsPerPage = 10;

const statusColorMap: Record<string, ChipProps["color"]> = {
  PENDING: "warning",
  DISBURSE: "primary",
  OVERPAID: "success",
  CLOSE: "danger",
};

const columns = [
  { name: "ID", uid: "id" },
  { name: "Marchand", uid: "merchantDisplayName", sortable: true },
  { name: "Fournisseur", uid: "supplierDisplayName", sortable: true },
  { name: "Achat total", uid: "totalPrice", sortable: true },
  { name: "Valeur due", uid: "totalDue", sortable: true },
  { name: "Date d'achat", uid: "createdAt" },
  { name: "Date d'échéance", uid: "maturityDate" },
  { name: "Retard", uid: "overdueDays", sortable: true },
  { name: "Statut", uid: "status" },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "PENDING" },
  { name: "En cours", uid: "DISBURSE" },
  { name: "Trop payé", uid: "OVERPAID" },
  { name: "Clôturée", uid: "CLOSE" },
];

const TransactionsList: FC = () => {
  // États
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>(
    new Set(["PENDING"])
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "merchantDisplayName",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [repayDateRange, setRepayDateRange] =
    useState<RangeValue<DateValue> | null>(null);
  const [maturityDateFilter, setMaturityDateFilter] = useState<Selection>(
    new Set([])
  );
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const {
    onOpen: onPurchOpen,
    onOpenChange: onPurchOpenChange,
    isOpen: isPurchOpen,
  } = useDisclosure();
  const {
    onOpen: onRepayOpen,
    onOpenChange: onRepayOpenChange,
    isOpen: isRepayOpen,
  } = useDisclosure();

  const {
    onOpen: onInvoiceOpen,
    onOpenChange: onInvoiceOpenChange,
    isOpen: isInvoiceOpen,
  } = useDisclosure();

  const {
    setSelectedTransaction,
    clearSelectedTransaction,
    fetchTransactions,
    transactions,
  } = useTransactionStore();

  // Mémos
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredTransactions = [...transactions];

    if (hasSearchFilter) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.merchantDisplayName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          transaction.supplierDisplayName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          transaction.id
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          transaction.merchantPhone
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }
    if (Array.from(statusFilter).length !== statusOptions.length) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        Array.from(statusFilter).includes(transaction.type)
      );
    }

    if (dateRange) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return (
          transactionDate >= dateRange.start.toDate(getLocalTimeZone()) &&
          transactionDate <= dateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    if (repayDateRange) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.maturityDate);
        return (
          transactionDate >= repayDateRange.start.toDate(getLocalTimeZone()) &&
          transactionDate <= repayDateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    if (Array.from(maturityDateFilter).includes("NO_MATURITY_DATE")) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => !transaction.maturityDate
      );
    }

    return filteredTransactions;
  }, [
    transactions,
    hasSearchFilter,
    statusFilter,
    filterValue,
    dateRange,
    repayDateRange,
    maturityDateFilter,
  ]);

  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, DISBURSE: 0, OVERPAID: 0, CLOSE: 0 };
    transactions.forEach((transaction) => {
      counts[transaction.type as keyof typeof counts]++;
    });
    return counts;
  }, [transactions]);

  // On trie l'ensemble des éléments filtrés
  const sortedFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a: ITransaction, b: ITransaction) => {
      let first = a[sortDescriptor.column as keyof ITransaction];
      let second = b[sortDescriptor.column as keyof ITransaction];

      if (
        sortDescriptor.column === "createdAt" ||
        sortDescriptor.column === "maturityDate"
      ) {
        first = new Date(first as string).getTime();
        second = new Date(second as string).getTime();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedFilteredItems.length / rowsPerPage);

  // On applique la pagination sur les éléments triés
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedFilteredItems.slice(start, end);
  }, [page, sortedFilteredItems]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setStatusFilter(new Set(statusOptions.map((option) => option.uid)));
      setPage(1);
    } else {
      setFilterValue("");
      setStatusFilter(new Set(["PENDING"]));
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback(
    (status: string) => {
      const newStatusFilter = new Set(statusFilter);
      if (newStatusFilter.has(status)) {
        newStatusFilter.delete(status);
      } else {
        newStatusFilter.add(status);
      }
      setStatusFilter(newStatusFilter);
      setPage(1);
    },
    [statusFilter]
  );

  const handleColumnClick = (columnClicked: string) => {
    if (columnClicked === "createdAt") {
      onPurchOpen();
    } else if (columnClicked === "maturityDate") {
      onRepayOpen();
    }
  };

  useEffect(() => {
    const _fetch = async () => {
      setIsLoading(true);
      await fetchTransactions();
      setIsLoading(false);
    };
    _fetch();
  }, [fetchTransactions]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("q");
    if (queryValue) {
      setFilterValue(queryValue);
      setStatusFilter(new Set(statusOptions.map((option) => option.uid)));
    }
  }, [location]);

  // Contenus
  const renderCell = useCallback(
    (transaction: ITransaction, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "id":
          return <p className="line-clamp-1 text-xs">TX{transaction.id}</p>;
        case "merchantDisplayName":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.merchantDisplayName}
            </p>
          );
        case "supplierDisplayName":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.supplierDisplayName}
            </p>
          );
        case "totalPrice":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.totalPrice.toLocaleString()} F
            </p>
          );
        case "createdAt":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.createdAt
                ? formatDate(transaction.createdAt)
                : "---"}
            </p>
          );
        case "maturityDate":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.maturityDate
                ? formatDate(transaction.maturityDate)
                : "---"}
            </p>
          );
        case "totalDue":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.totalDue.toLocaleString()} F
            </p>
          );
        case "overdueDays":
          return (
            <p className="line-clamp-1 text-xs">
              {transaction.overdueDays} jour
              {transaction.overdueDays > 1 && "s"}
            </p>
          );
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={statusColorMap[transaction.type]}
              size="sm"
              variant="dot"
            >
              {formatTransactionStatus(transaction.type)}
            </Chip>
          );
        case "actions":
          return (
            <div className="!font-montserrat relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <i className="text-gray-500 fa-solid fa-ellipsis-vertical"></i>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu disabledKeys={["other"]}>
                  <DropdownItem
                    endContent={<i className="fa-solid fa-eye"></i>}
                    key="invoice"
                    onPress={() => {
                      setSelectedTransactionId(transaction.id.toString());
                      onInvoiceOpen();
                    }}
                  >
                    <span className="!font-montserrat text-xs">
                      Voir facture
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    endContent={<i className="fa-solid fa-money-bill-wave"></i>}
                    key="disbursement"
                    onPress={() => {
                      navigate(`/disbursements?q=${transaction.id}`);
                    }}
                  >
                    <span className="!font-montserrat text-xs">
                      Voir déboursement
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    endContent={<i className="fa-solid fa-rocket"></i>}
                    key="other"
                  >
                    <span className="!font-montserrat text-xs">
                      Autre actions
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return <></>;
      }
    },
    [navigate, onInvoiceOpen]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-start">
          <Input
            isClearable
            className="max-w-[350px]"
            placeholder="Rechercher..."
            description={
              <div className="line-clamp-1">
                ID, Marchand, Fournisseur, Téléphone...
              </div>
            }
            startContent={<i className="fa-regular fa-search"></i>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            classNames={{
              base: "!bg-slate-100 w-full",
              inputWrapper: "!bg-white",
              input: "placeholder:!text-xs text-xs",
            }}
          />

          {/* filters - mobile */}
          <div className="flex md:hidden gap-3 ">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="flat" className="shadow-sm">
                  <i className="fa-regular fa-filter-list"></i>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    <span className="!font-[Montserrat] !text-xs font-semibold">
                      {capitalize(status.name)} (
                      {statusCounts[status.uid as keyof typeof statusCounts]})
                    </span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* filters - desktop */}
          <div className="md:flex hidden space-x-2">
            {statusOptions.map((status) => (
              <Button
                key={status.uid}
                className="text-[10px]"
                onPress={() => handleStatusFilter(status.uid)}
                color={
                  statusFilter instanceof Set && statusFilter.has(status.uid)
                    ? statusColorMap[status.uid]
                    : "default"
                }
                radius="full"
                size="sm"
              >
                {status.name} (
                {statusCounts[status.uid as keyof typeof statusCounts]})
              </Button>
            ))}

            <Button
              radius="full"
              size="sm"
              variant={
                !(
                  maturityDateFilter instanceof Set &&
                  maturityDateFilter.has("NO_MATURITY_DATE")
                )
                  ? "bordered"
                  : "solid"
              }
              color={
                !(
                  maturityDateFilter instanceof Set &&
                  maturityDateFilter.has("NO_MATURITY_DATE")
                )
                  ? "default"
                  : "primary"
              }
              className="shadow-sm"
              onPress={() => {
                if (
                  maturityDateFilter instanceof Set &&
                  maturityDateFilter.has("NO_MATURITY_DATE")
                ) {
                  setMaturityDateFilter(new Set([]));
                } else {
                  setMaturityDateFilter(new Set(["NO_MATURITY_DATE"]));
                }
                setPage(1);
              }}
            >
              {capitalize("échéance vide", true)}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-bold ~text-sm/base">Liste des transactions</h2>
          <div className="flex items-center gap-3">
            <span className="text-default-400 text-xs">
              {filteredItems.length} résultat
              {filteredItems.length > 1 && "s"}
            </span>
            <Tooltip
              content="Rafraîchir la liste"
              placement="top"
              showArrow
              classNames={{
                content: "!text-xs !font-[Montserrat] !bg-white",
              }}
            >
              <Button
                color="primary"
                variant="shadow"
                size="sm"
                isIconOnly
                onPress={async () => {
                  setIsLoading(true);
                  await fetchTransactions();
                  setIsLoading(false);
                }}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    maturityDateFilter,
    filteredItems.length,
    onClear,
    statusCounts,
    handleStatusFilter,
    fetchTransactions,
  ]);

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

  return (
    <>
      <PurchFilter
        isOpen={isPurchOpen}
        onOpenChange={onPurchOpenChange}
        onFilterChange={(dateRange) => {
          setDateRange(dateRange);
          setSortDescriptor({ column: "createdAt", direction: "ascending" });
        }}
      />
      <RepayFilter
        isOpen={isRepayOpen}
        onOpenChange={onRepayOpenChange}
        onFilterChange={(dateRange) => {
          setRepayDateRange(dateRange);
          setSortDescriptor({ column: "maturityDate", direction: "ascending" });
        }}
      />
      <Invoice
        isOpen={isInvoiceOpen}
        onOpenChange={onInvoiceOpenChange}
        transactionId={selectedTransactionId || ""}
      />
      <Table
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          emptyWrapper: "h-[493px] overflow-y-auto",
          loadingWrapper: "h-[493px] overflow-y-auto",
          tr: "cursor-pointer",
        }}
        selectionMode="single"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={(keys) => {
          if (keys === "all" || Array.from(keys).length === 0) {
            clearSelectedTransaction();
          } else {
            const selectedKey = Array.from(keys)[0] as string;
            const selectedTransaction = transactions.find(
              (transaction) => transaction.id.toString() === selectedKey
            );
            if (selectedTransaction) {
              setSelectedTransaction(selectedTransaction);
              console.log(selectedTransaction);
            }
          }
          setSelectedKeys(keys);
        }}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              onClick={() => handleColumnClick(column.uid)}
              key={column.uid}
              allowsSorting={column.sortable}
              className={`${
                (column.uid === "createdAt" || column.uid === "maturityDate") &&
                "hover:text-zinc-400 group"
              }`}
            >
              {column.name}

              {column.uid === "createdAt" ? (
                <i
                  className={`ml-3 fa-regular fa-filter text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                ></i>
              ) : column.uid === "maturityDate" ? (
                <i
                  className={`ml-3 fa-regular fa-filter text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                ></i>
              ) : null}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner color="primary" />
            </div>
          }
          emptyContent={
            <div className="flex flex-col justify-center items-center">
              <i className="fa-duotone fa-warning"></i>
              <p>Aucune transaction</p>
            </div>
          }
          items={items}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionsList;
