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
} from "@heroui/react";
import {
  FC,
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getConciliations,
  getPaymentRecommendations,
  IConciliation,
} from "../../api/services/conciliationService";
import { ISuggestion, useSuggestionStore } from "../../store/suggestionStore";
import { capitalize, formatDate } from "../../utils/formatters";

const statusColorMap: Record<string, ChipProps["color"]> = {
  FULLY_RECONCILED: "success",
  NOT_RECONCILED: "danger",
  PARTIALLY_RECONCILED: "warning",
};

const columns = [
  { name: "ID", uid: "julayaId" },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Reste à concilier", uid: "remainingAmount", sortable: true },
  { name: "Numéro Client", uid: "clientNumber" },
  { name: "Compte", uid: "account" },
  { name: "Date", uid: "date", sortable: true },
  { name: "Concilié ?", uid: "status" },
];

const statusOptions = [
  { name: "Oui", uid: "FULLY_RECONCILED" },
  { name: "Non", uid: "NOT_RECONCILED" },
  { name: "Partiellement", uid: "PARTIALLY_RECONCILED" },
];

const isMobile = () => window.innerWidth <= 768;

const ConciliationsList: FC = () => {
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const { setSuggestions, setConciliationData } = useSuggestionStore();

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>(
    new Set(["NOT_RECONCILED"])
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "julayaId", // colonne par défaut (à ajuster selon vos besoins)
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [conciliations, setConciliations] = useState<IConciliation[]>([]);

  const hasSearchFilter = Boolean(filterValue);

  // Filtrage sur l'ensemble des données
  const filteredItems = useMemo(() => {
    let filteredConciliations = [...conciliations];

    if (hasSearchFilter) {
      filteredConciliations = filteredConciliations.filter(
        (conciliation) =>
          conciliation.clientNumber
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          conciliation.id
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredConciliations = filteredConciliations.filter((conciliation) =>
        Array.from(statusFilter).includes(
          conciliation.status === "FULLY_RECONCILED"
            ? "FULLY_RECONCILED"
            : conciliation.status === "PARTIALLY_RECONCILED"
            ? "PARTIALLY_RECONCILED"
            : "NOT_RECONCILED"
        )
      );
    }

    return filteredConciliations;
  }, [hasSearchFilter, statusFilter, filterValue, conciliations]);

  // Tri sur l'ensemble des éléments filtrés
  const sortedFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a: IConciliation, b: IConciliation) => {
      let first = a[sortDescriptor.column as keyof IConciliation];
      let second = b[sortDescriptor.column as keyof IConciliation];

      // Gestion du tri en fonction du type de données
      if (
        sortDescriptor.column === "amount" ||
        sortDescriptor.column === "remainingAmount"
      ) {
        first = Number(first);
        second = Number(second);
      } else if (sortDescriptor.column === "date") {
        first = new Date(first as string).getTime();
        second = new Date(second as string).getTime();
      } else {
        // Comparaison par défaut en traitant les valeurs comme des chaînes de caractères
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
      }

      if (first < second)
        return sortDescriptor.direction === "descending" ? 1 : -1;
      if (first > second)
        return sortDescriptor.direction === "descending" ? -1 : 1;
      return 0;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedFilteredItems.length / rowsPerPage);

  // Pagination appliquée sur les éléments triés
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedFilteredItems.slice(start, end);
  }, [page, sortedFilteredItems, rowsPerPage]);

  const sortedItems = items; // Pour compatibilité avec l'affichage

  const renderCell = useCallback(
    (conciliation: IConciliation, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "julayaId":
          return <p className="line-clamp-1 text-xs">J{conciliation.id}</p>;
        case "amount":
          return (
            <p className="line-clamp-1 text-xs">{conciliation.amount} F</p>
          );
        case "remainingAmount":
          return (
            <p className="line-clamp-1 text-xs">
              {conciliation.remainingAmount} F
            </p>
          );
        case "clientNumber":
          return (
            <p className="line-clamp-1 text-xs">{conciliation.clientNumber}</p>
          );
        case "account":
          return <p className="line-clamp-1 text-xs">{conciliation.account}</p>;
        case "date":
          return (
            <p className="line-clamp-1 text-xs">
              {formatDate(conciliation.date)}
            </p>
          );
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={
                conciliation.status === "FULLY_RECONCILED"
                  ? statusColorMap.FULLY_RECONCILED
                  : conciliation.status === "PARTIALLY_RECONCILED"
                  ? statusColorMap.PARTIALLY_RECONCILED
                  : statusColorMap.NOT_RECONCILED
              }
              size="sm"
              variant="dot"
            >
              {conciliation.status === "FULLY_RECONCILED"
                ? "Oui"
                : conciliation.status === "PARTIALLY_RECONCILED"
                ? "Partiellement"
                : "Non"}
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

  const fetchTransactions = async () => {
    try {
      setConciliations([]);
      setIsLoading(true);
      const response = await getConciliations();
      const conciliationsData = response.data as IConciliation[];
      const notReconciledIds = conciliationsData
        .filter((conciliation) => conciliation.status === "NOT_RECONCILED")
        .map((conciliation) => conciliation.id);
      console.log(notReconciledIds);
      setConciliations(conciliationsData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSuggestions(null);
    fetchTransactions();
  }, [setSuggestions]);

  const statusCounts = useMemo(() => {
    const counts = {
      FULLY_RECONCILED: 0,
      NOT_RECONCILED: 0,
      PARTIALLY_RECONCILED: 0,
    };
    conciliations.forEach((conciliation) => {
      counts[conciliation.status as keyof typeof counts]++;
    });
    return counts;
  }, [conciliations]);

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

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-start">
          <Input
            isClearable
            className="max-w-[300px]"
            placeholder="Rechercher..."
            description="ID Julaya, Numero Client..."
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
          {/* Filtres – version mobile */}
          <div className="flex sm:hidden gap-3">
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
                onSelectionChange={setStatusFilter}
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
          {/* Filtres – version desktop */}
          <div className="hidden sm:block space-x-2">
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("NOT_RECONCILED")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set &&
                statusFilter.has("NOT_RECONCILED")
                  ? "danger"
                  : "default"
              }
            >
              Non ({statusCounts.NOT_RECONCILED})
            </Button>
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("FULLY_RECONCILED")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set &&
                statusFilter.has("FULLY_RECONCILED")
                  ? "success"
                  : "default"
              }
            >
              Oui ({statusCounts.FULLY_RECONCILED})
            </Button>
            <Button
              className="text-[10px]"
              onPress={() => handleStatusFilter("PARTIALLY_RECONCILED")}
              radius="full"
              size="sm"
              color={
                statusFilter instanceof Set &&
                statusFilter.has("PARTIALLY_RECONCILED")
                  ? "warning"
                  : "default"
              }
            >
              Partiellement ({statusCounts.PARTIALLY_RECONCILED})
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-bold ~text-sm/base">Liste des paiements</h2>
          <div className="flex items-center gap-2">
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
                onPress={() => fetchTransactions()}
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
    filteredItems.length,
    onClear,
    handleStatusFilter,
    statusCounts,
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
  }, [page, pages]);

  return (
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
      onSelectionChange={async (keys) => {
        if (keys === "all" || Array.from(keys).length === 0) {
          setSuggestions(null);
          setConciliationData(null);
        } else {
          const selectedKey = Array.from(keys)[0] as string;
          const selectedConciliation = conciliations.find(
            (conciliation) => conciliation.id.toString() === selectedKey
          );
          if (selectedConciliation) {
            console.log(selectedConciliation);
            setConciliationData({
              idJulaya: selectedConciliation.id,
              amount: selectedConciliation.amount,
            });
            try {
              const response = await getPaymentRecommendations(
                selectedConciliation.id
              );
              console.log(response);
              setSuggestions(response.data as ISuggestion[]);
            } catch (error) {
              console.log(error);
            }
          }
        }
        if (isMobile()) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
        setSelectedKeys(keys);
      }}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "status" ? "end" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner color="primary" />
          </div>
        }
        emptyContent={"Liste de données vide"}
        items={sortedItems}
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
  );
};

export default ConciliationsList;
