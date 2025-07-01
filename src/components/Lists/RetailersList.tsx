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
import { getRetailerById } from "../../api/services/retailersServices";
import { useClientStore } from "../../store/clientStore";
import { IRetailer, useRetailerStore } from "../../store/retailersStore";
import { capitalize, formatRetailerStatus } from "../../utils/formatters";

const statusColorMap: Record<string, ChipProps["color"]> = {
  VERIFIE: "success",
  LISTE_NOIRE: "danger",
  EN_ATTENTE: "warning",
};

const columns = [
  { name: "Nom et prenoms", uid: "name" },
  { name: "Statuts", uid: "status" },
];

const statusOptions = [
  { name: "Vérifié", uid: "VERIFIE" },
  { name: "En attente", uid: "EN_ATTENTE" },
  { name: "Liste noire", uid: "LISTE_NOIRE" },
];

const RetailersList: FC = () => {
  const { setSelectedClient } = useClientStore();
  const rowsPerPage = 10;
  const {
    setSelectedRetailer,
    clearSelectedRetailer,
    fetchRetailers,
    retailers,
  } = useRetailerStore();

  useEffect(() => {
    const _fetchRetailers = async () => {
      setIsLoading(true);
      await fetchRetailers();
      setIsLoading(false);
    };
    _fetchRetailers();
  }, [fetchRetailers]);

  // États
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  // Fonctions de filtre et de tri
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredUsers = Array.isArray(retailers) ? [...retailers] : [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.masterStatus)
      );
    }

    return filteredUsers;
  }, [retailers, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.length > 5
      ? filteredItems.slice(start, end)
      : filteredItems;
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: IRetailer, b: IRetailer) => {
      const first = a[sortDescriptor.column as keyof IRetailer] as number;
      const second = b[sortDescriptor.column as keyof IRetailer] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Fonctions de gestion des filtres
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

  // Rendu des cellules de la table
  const renderCell = useCallback(
    (user: IRetailer, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "name":
          return <p className="line-clamp-1">{capitalize(user.name, true)}</p>;
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={statusColorMap[user.masterStatus]}
              size="sm"
              variant="dot"
            >
              {formatRetailerStatus(user.masterStatus)}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <i className="text-gray-500 fa-solid fa-ellipsis-vertical"></i>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="see">Voir</DropdownItem>
                  <DropdownItem key="update">Modifier</DropdownItem>
                  <DropdownItem key="delete">Supprimer</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return <></>;
      }
    },
    []
  );

  // Contenu supérieur
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="max-w-[250px]"
            placeholder="Rechercher détaillant..."
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
          <div className="flex gap-3">
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
                      {capitalize(status.name)}
                    </span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-bold ~text-sm/base">Liste des détaillants</h2>
          <span className="text-default-400 text-xs">
            {filteredItems.length} résultat{filteredItems.length > 1 && "s"}
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    filteredItems.length,
    onClear,
  ]);

  // Contenu inférieur
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
          clearSelectedRetailer();
        } else {
          const selectedKey = Array.from(keys)[0] as string;
          const selectedRetailer = retailers?.find(
            (retailer) => retailer.id.toString() === selectedKey
          );
          console.log(selectedRetailer);
          if (selectedRetailer) {
            try {
              const responseA = await getRetailerById(selectedRetailer.id, {
                role: "MERCHANT",
              });
              console.log(responseA.data);
              if ("id" in responseA.data) {
                setSelectedClient({
                  ...responseA.data,
                  id: responseA.data.id?.toString() || "",
                });
              }
              setSelectedRetailer({
                ...responseA.data,
                type: selectedRetailer.type,
                masterStatus: selectedRetailer.masterStatus,
              } as IRetailer); // Mets à jour les données dans le store global.
            } catch (error) {
              console.error(
                "Erreur lors de la récupération du détaillant :",
                error
              );
            }
          } else {
            console.warn("Détaillant non trouvé avec cet ID :", selectedKey);
          }
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
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner color="primary" />}
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

export default RetailersList;
