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
import { getSupplierById } from "../../api/services/prospectService";
import { getAllSuppliers } from "../../api/services/supplierService";
import useSuppliersStepStore from "../../store/suppliersStepStore";
import { ISupplier, useSupplierStore } from "../../store/supplierStore";
import { capitalize, formatSupplierStatus } from "../../utils/formatters";
import { Step1FormDataS } from "../types/form";

// Définition des couleurs pour les statuts
const statusColorMap: Record<string, ChipProps["color"]> = {
  VERIFIE: "success",
  LISTE_NOIRE: "danger",
  EN_ATTENTE: "warning",
};

// Définition des colonnes de la table
const columns = [
  { name: "Nom et prenoms", uid: "name" },
  { name: "Statuts", uid: "status" },
];

// Options de filtre par statut
const statusOptions = [
  { name: "Vérifié", uid: "VERIFIE" },
  { name: "En attente", uid: "EN_ATTENTE" },
  { name: "Liste noire", uid: "LISTE_NOIRE" },
];

const SuppliersList: FC = () => {
  const rowsPerPage = 10;
  const { clearSelectedSupplier, setSelectedSupplier } = useSupplierStore();
  const { steps, resetStore, setFormData } = useSuppliersStepStore();
  const isCompleted = steps[2].completed;

  // États pour gérer les filtres, tri, pagination et données
  const [isLoading, setIsLoading] = useState(true); // Pour afficher le spinner de chargement des suppliers
  const [isGettingSupplier, setIsGettingSupplier] = useState(false); // Pour afficher le spinner de chargement du supplier sélectionné
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  // Filtres et tri des données
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredUsers = [...suppliers];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name?.toLowerCase().includes(filterValue.toLowerCase())
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
  }, [suppliers, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.length > 5
      ? filteredItems.slice(start, end)
      : filteredItems;
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: ISupplier, b: ISupplier) => {
      const first = a[sortDescriptor.column as keyof ISupplier] as number;
      const second = b[sortDescriptor.column as keyof ISupplier] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Rendu des cellules de la table
  const renderCell = useCallback(
    (supplier: ISupplier, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "name":
          return (
            <p className="line-clamp-1">{capitalize(supplier.name, true)}</p>
          );
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={statusColorMap[supplier.masterStatus]}
              size="sm"
              variant="dot"
            >
              {formatSupplierStatus(supplier.masterStatus)}
            </Chip>
          );
        default:
          return <></>;
      }
    },
    []
  );

  // Gestion des filtres
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

  // Contenu supérieur
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="max-w-[250px]"
            placeholder="Rechercher fournisseur..."
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
          <h2 className="font-bold ~text-sm/base flex items-center gap-2">
            Liste des fournisseur{" "}
            {isGettingSupplier && (
              <Spinner size="sm" color="primary" className="scale-[.8]" />
            )}{" "}
          </h2>
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
    isGettingSupplier,
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

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        setSuppliers([]);
        const response = await getAllSuppliers({ simplify: false });
        console.log(response);
        if (response.data && response.data.results) {
          setSuppliers(response.data.results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
    // On fetch aussi les fournisseurs lorsqu'on termine la validation
  }, [isCompleted]);

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
        resetStore();
        if (keys === "all" || Array.from(keys).length === 0) {
          setSelectedSupplier(null);
          clearSelectedSupplier(); // Si aucune sélection, on réinitialise.
          setSelectedKeys(new Set([]));
        } else {
          const selectedKey = Array.from(keys)[0] as string; // ID du fournisseur sélectionné.
          const selectedSupplier = suppliers.find(
            (supplier) => supplier.id.toString() === selectedKey
          );

          if (selectedSupplier) {
            console.log(selectedSupplier);
            try {
              setIsGettingSupplier(true);
              const response = await getSupplierById(
                parseInt(selectedKey, 10),
                { type: selectedSupplier.type }
              );
              console.log("Fournisseur sélectionné :", response.data); // Affiche les détails dans la console.
              setSelectedSupplier({
                ...response.data,
                type: selectedSupplier.type,
                masterStatus: selectedSupplier.masterStatus,
              } as ISupplier); // Mets à jour les données dans le store global.
              setFormData(1, response.data as unknown as Step1FormDataS);
            } catch (error) {
              console.error(
                "Erreur lors de la récupération du fournisseur :",
                error
              );
            } finally {
              setIsGettingSupplier(false);
            }
          } else {
            console.warn("Fournisseur non trouvé avec cet ID :", selectedKey);
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

export default SuppliersList;
