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
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import {
  getAllDisbursements,
  IDisbursement,
  updateDisbursement,
} from "../../api/services/disbursementService";
import {
  capitalize,
  formatDate,
  formatDisbursementStatus,
} from "../../utils/formatters";
import PayOutAll from "../Disbursements/PayOutAll";
import PurchFilter from "../Transactions/PurchFilter";
import RepayFilter from "../Transactions/RepayFilter";

const statusColorMap: Record<string, ChipProps["color"]> = {
  INIT: "secondary",
  PENDING: "warning",
  PAYED: "success",
  FAILED: "danger",
};

const columns = [
  { name: "ID Déboursement", uid: "id" },
  { name: "ID Transaction", uid: "txId" },
  { name: "Fournisseur", uid: "displayName", sortable: true },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Date prévue", uid: "disbursementDate" },
  { name: "Date réelle", uid: "effectiveDisbursementDate" },
  { name: "Numéro de paiement", uid: "paymentNumber" },
  { name: "Statut", uid: "status" },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Initialisé", uid: "INIT" },
  { name: "En attente", uid: "PENDING" },
  { name: "Payé", uid: "PAYED" },
  { name: "Échoué", uid: "FAILED" },
];

const DisbursementsList: FC = () => {
  const rowsPerPage = 10;
  const {
    onOpen: onPayOpen,
    onOpenChange: onPayOpenChange,
    isOpen: isPayOpen,
  } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>(
    new Set(["PENDING"])
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "displayName",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [disbursements, setDisbursements] = useState<IDisbursement[]>([]);
  const [isGettingDisbursements, setIsGettingDisbursements] = useState(true);
  const [effectiveDateFilter, setEffectiveDateFilter] = useState<Selection>(
    new Set([])
  );
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [repayDateRange, setRepayDateRange] =
    useState<RangeValue<DateValue> | null>(null);
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

  const hasSearchFilter = Boolean(filterValue);

  // Filtrage
  const filteredItems = useMemo(() => {
    let filteredDisbursements = [...disbursements];

    if (hasSearchFilter) {
      filteredDisbursements = filteredDisbursements.filter(
        (disbursement) =>
          disbursement.supplier.displayName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          disbursement.id.toString().includes(filterValue) ||
          disbursement.transaction.id.toString().includes(filterValue)
      );
    }
    if (Array.from(statusFilter).length !== statusOptions.length) {
      filteredDisbursements = filteredDisbursements.filter((disbursement) =>
        Array.from(statusFilter).includes(disbursement.status)
      );
    }

    if (Array.from(effectiveDateFilter).includes("NO_EFFECTIVE_DATE")) {
      filteredDisbursements = filteredDisbursements.filter(
        (disbursement) => !disbursement.effectiveDisbursementDate
      );
    }

    if (dateRange) {
      filteredDisbursements = filteredDisbursements.filter((disbursement) => {
        const disbursementDate = new Date(disbursement.disbursementDate);
        return (
          disbursementDate >= dateRange.start.toDate(getLocalTimeZone()) &&
          disbursementDate <= dateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    if (repayDateRange) {
      filteredDisbursements = filteredDisbursements.filter((disbursement) => {
        const effectiveDate = disbursement.effectiveDisbursementDate
          ? new Date(disbursement.effectiveDisbursementDate)
          : new Date();
        return (
          effectiveDate >= repayDateRange.start.toDate(getLocalTimeZone()) &&
          effectiveDate <= repayDateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    return filteredDisbursements;
  }, [
    disbursements,
    hasSearchFilter,
    statusFilter,
    filterValue,
    effectiveDateFilter,
    dateRange,
    repayDateRange,
  ]);

  // Tri sur l'ensemble des éléments filtrés
  const sortedFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a: IDisbursement, b: IDisbursement) => {
      let first = a[sortDescriptor.column as keyof IDisbursement];
      let second = b[sortDescriptor.column as keyof IDisbursement];

      if (sortDescriptor.column === "amount") {
        first = a.transaction.amount;
        second = b.transaction.amount;
      } else if (sortDescriptor.column === "displayName") {
        first = a.supplier.displayName.toLowerCase();
        second = b.supplier.displayName.toLowerCase();
      }

      const cmp =
        (first ?? "") < (second ?? "")
          ? -1
          : (first ?? "") > (second ?? "")
          ? 1
          : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedFilteredItems.length / rowsPerPage);

  // Pagination sur les éléments triés
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedFilteredItems.slice(start, end);
  }, [page, sortedFilteredItems, rowsPerPage]);

  const statusCounts = useMemo(() => {
    const counts = { INIT: 0, PENDING: 0, PAYED: 0, FAILED: 0 };
    disbursements.forEach((disbursement) => {
      counts[disbursement.status]++;
    });
    return counts;
  }, [disbursements]);

  const renderCell = useCallback(
    (disbursement: IDisbursement, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "id":
          return <p className="line-clamp-1 text-xs">D{disbursement.id}</p>;
        case "txId":
          return (
            <p className="line-clamp-1 text-xs">
              TX{disbursement.transaction.id}
            </p>
          );
        case "displayName":
          return (
            <p className="line-clamp-1 text-xs">
              {disbursement.supplier.displayName}
            </p>
          );
        case "amount":
          return (
            <p className="line-clamp-1 text-xs">
              {disbursement.transaction.amount} F
            </p>
          );
        case "disbursementDate":
          return (
            <p className="line-clamp-1 text-xs">
              {formatDate(disbursement.disbursementDate)}
            </p>
          );
        case "effectiveDisbursementDate":
          return (
            <p className="line-clamp-1 text-xs">
              {disbursement.effectiveDisbursementDate
                ? formatDate(disbursement.effectiveDisbursementDate)
                : "---"}
            </p>
          );
        case "paymentNumber":
          return (
            <p className="line-clamp-1 text-xs">
              {disbursement.supplier.paymentNumber
                ? disbursement.supplier.paymentNumber
                : "---"}
            </p>
          );
        case "actions":
          return (
            <div className="!font-montserrat relative flex justify-center items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <i className="text-gray-500 fa-solid fa-ellipsis-vertical"></i>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disabledKeys={
                    disbursement.status !== "INIT"
                      ? ["payOut", "markAsPending"]
                      : ["payOut"]
                  }
                >
                  <DropdownItem
                    endContent={
                      <i className="fa-solid fa-hand-holding-dollar"></i>
                    }
                    key="payOut"
                  >
                    <span className="!font-montserrat text-xs">Débourser</span>
                  </DropdownItem>
                  <DropdownItem
                    onPress={async () => {
                      try {
                        const response = await updateDisbursement(
                          disbursement.id,
                          {
                            transactionId: disbursement.transaction.id,
                            disbursementDate: new Date().toISOString(),
                            isDisbursed: true,
                            status: "PAYED",
                          }
                        );
                        console.log(response);
                        if (response.success) {
                          toast.success("Décaissement marqué comme déboursé");
                        } else {
                          toast.error(
                            "Erreur lors du marquage du décaissement comme déboursé"
                          );
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    endContent={<i className="fa-solid fa-check-circle"></i>}
                    key="markAsDisbursed"
                  >
                    <span className="!font-montserrat text-xs">
                      Marquer déboursé
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    onPress={async () => {
                      try {
                        const response = await updateDisbursement(
                          disbursement.id,
                          {
                            transactionId: disbursement.transaction.id,
                            status: "PENDING",
                          }
                        );
                        console.log(response);
                        if (response.success) {
                          toast.success("Décaissement marqué comme en attente");
                        } else {
                          toast.error(
                            "Erreur lors du marquage du décaissement comme en attente"
                          );
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    endContent={<i className="fa-solid fa-hourglass-start"></i>}
                    key="markAsPending"
                  >
                    <span className="!font-montserrat text-xs">
                      Mettre en attente
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={statusColorMap[disbursement.status]}
              size="sm"
              variant="dot"
            >
              {formatDisbursementStatus(disbursement.status)}
            </Chip>
          );
        default:
          return <></>;
      }
    },
    []
  );

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

  const location = useLocation();

  const fetchDisbursements = async () => {
    try {
      setIsGettingDisbursements(true);
      setDisbursements([]);
      const response = await getAllDisbursements();
      setDisbursements(response.data as unknown as IDisbursement[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingDisbursements(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("q");
    if (queryValue) {
      setFilterValue(queryValue);
      setStatusFilter(new Set(statusOptions.map((option) => option.uid)));
    }
  }, [location]);

  const handleColumnClick = (columnClicked: string) => {
    if (columnClicked === "disbursementDate") {
      onPurchOpen();
    } else if (columnClicked === "effectiveDisbursementDate") {
      onRepayOpen();
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-start">
          <Input
            isClearable
            className="max-w-[300px]"
            placeholder="Rechercher..."
            startContent={<i className="fa-regular fa-search"></i>}
            description="ID Transaction, ID Transaction, Fournisseur..."
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
          <div className="flex sm:hidden gap-3 ">
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
          <div className="hidden sm:block space-x-2">
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("PENDING")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set && statusFilter.has("PENDING")
                  ? "warning"
                  : "default"
              }
            >
              En attente ({statusCounts.PENDING})
            </Button>
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("INIT")}
              color={
                statusFilter instanceof Set && statusFilter.has("INIT")
                  ? "secondary"
                  : "default"
              }
              radius="full"
              size="sm"
            >
              Initialisé ({statusCounts.INIT})
            </Button>
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("PAYED")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set && statusFilter.has("PAYED")
                  ? "success"
                  : "default"
              }
            >
              Payé ({statusCounts.PAYED})
            </Button>
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("FAILED")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set && statusFilter.has("FAILED")
                  ? "danger"
                  : "default"
              }
            >
              Échoué ({statusCounts.FAILED})
            </Button>
            <Button
              radius="full"
              size="sm"
              variant={
                !(
                  effectiveDateFilter instanceof Set &&
                  effectiveDateFilter.has("NO_EFFECTIVE_DATE")
                )
                  ? "bordered"
                  : "solid"
              }
              color={
                !(
                  effectiveDateFilter instanceof Set &&
                  effectiveDateFilter.has("NO_EFFECTIVE_DATE")
                )
                  ? "default"
                  : "primary"
              }
              className="shadow-sm"
              onPress={() => {
                if (
                  effectiveDateFilter instanceof Set &&
                  effectiveDateFilter.has("NO_EFFECTIVE_DATE")
                ) {
                  setEffectiveDateFilter(new Set([]));
                } else {
                  setEffectiveDateFilter(new Set(["NO_EFFECTIVE_DATE"]));
                }
                setPage(1);
              }}
            >
              {capitalize("date réelle vide", true)}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-bold ~text-sm/base">Liste des transactions</h2>

          <div className="flex items-center justify-between gap-3">
            <Button
              color="primary"
              size="sm"
              variant="shadow"
              onPress={onPayOpen}
            >
              Débourser par fournisseur
            </Button>

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
                onPress={() => fetchDisbursements()}
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
    onPayOpen,
    onClear,
    handleStatusFilter,
    statusCounts,
    effectiveDateFilter,
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
      <PayOutAll
        disbursements={disbursements}
        isOpen={isPayOpen}
        onOpenChange={onPayOpenChange}
        fetchDisbursements={fetchDisbursements}
      />
      <PurchFilter
        isOpen={isPurchOpen}
        onOpenChange={onPurchOpenChange}
        onFilterChange={(dateRange) => {
          setDateRange(dateRange);
          setSortDescriptor({
            column: "disbursementDate",
            direction: "ascending",
          });
        }}
      />
      <RepayFilter
        isOpen={isRepayOpen}
        onOpenChange={onRepayOpenChange}
        onFilterChange={(dateRange) => {
          setRepayDateRange(dateRange);
          setSortDescriptor({
            column: "effectiveDisbursementDate",
            direction: "ascending",
          });
        }}
      />
      <Table
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          emptyWrapper: "h-[493px] overflow-y-auto",
          loadingWrapper: "h-[493px] overflow-y-auto",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={(keys) => {
          if (keys === "all" || Array.from(keys).length === 0) {
            console.log();
          } else {
            const selectedKey = Array.from(keys)[0] as string;
            const selectedDisbursement = disbursements.find(
              (disbursement) => disbursement.id.toString() === selectedKey
            );
            if (selectedDisbursement) {
              console.log(selectedDisbursement);
            }
          }
        }}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              onClick={() => handleColumnClick(column.uid)}
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className={`${
                (column.uid === "disbursementDate" ||
                  column.uid === "effectiveDisbursementDate") &&
                "hover:text-zinc-400 group"
              }`}
            >
              {column.name}{" "}
              {(column.uid === "disbursementDate" && (
                <i className="ml-3 fa-regular fa-filter text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
              )) ||
                (column.uid === "effectiveDisbursementDate" && (
                  <i className="ml-3 fa-regular fa-filter text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                ))}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isGettingDisbursements}
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

export default DisbursementsList;
