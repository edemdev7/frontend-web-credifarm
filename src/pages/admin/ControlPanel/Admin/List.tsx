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
  useDisclosure,
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
import { useLocation, useNavigate } from "react-router-dom";
import { IAdmin, INewAdmin } from "../../../../components/types/admin";
import { useAdminListStore } from "../../../../store/Admin/adminListStore";
import {
  capitalize,
  formatAdminRole,
} from "../../../../utils/formatters";
import * as Enums from '../../../../utils/enums';
import toast from "react-hot-toast";
import { 
  addAdmin, 
  deleteAdmin, 
  editAdmin, 
  upgradeToSuperAdmin, 
  downgradeToAdmin 
} from "../../../../api/services/admin/adminService";
import { AdminForm } from './Form';

// Constants
const ROWS_PER_PAGE = 8;

const statusColorMap: Record<string, ChipProps["color"]> = {
  ADMIN: "primary",
  SUPER_ADMIN: "success",
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Nom", uid: "name", sortable: true },
  { name: "Nom utilisateur", uid: "username", sortable: true },
  { name: "Role", uid: "isSuperAdmin" },
  { name: "Actions", uid: "actions" },
];

const STATUS_OPTIONS = [
  { name: "Tous", uid: "ALL" },
  { name: "Admin", uid: "ADMIN" },
  { name: "Super Admin", uid: "SUPER_ADMIN" },
];

const AdminList: FC = () => {
  // States
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["ALL"]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  
  // Get user role from local storage
  const [role] = useState(localStorage.getItem("accessToken")?.substring(0, 3) || '');
  
  // Modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isEditModalOpen, 
    onOpen: onEditModalOpen, 
    onClose: onEditModalClose 
  } = useDisclosure();

  // Selected admin for editing
  const [adminToEdit, setAdminToEdit] = useState<IAdmin | null>(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedAdmin, clearSelectedAdmin, fetchAdmins, admins } = useAdminListStore();

  // CRUD handlers
  const onAddAdmin = async (newAdminData: INewAdmin) => {
    try {
      setIsLoading(true);
      console.log("New admin data", newAdminData);
      const response = await addAdmin(newAdminData);
      if (response.status === 201) {
        toast.success("Admin ajouté avec succès");
        await fetchAdmins();
      } else {
        toast.error(`Erreur lors de l'ajout de l'admin: ${response.message || response.status}`);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'ajout de l'admin");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditAdmin = (id: number) => async (updatedAdminData: INewAdmin ) => {
    try {
      setIsLoading(true);
      const response = await editAdmin(id, updatedAdminData);
      console.log("Edit response", response);
      if (response.status === 200) {
        toast.success("Admin modifié avec succès");
        await fetchAdmins();
        onEditModalClose();
      } else {
        toast.error(`Erreur lors de la modification de l'admin: ${response.message || response.status}`);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la modification de l'admin");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteAdmin = (id: number) => async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet admin ?")) {
      try {
        setIsLoading(true);
        const response = await deleteAdmin(id);
        if (response.status === 200) {
          toast.success("Admin supprimé avec succès");
          await fetchAdmins();
        } else {
          toast.error(`Erreur lors de la suppression de l'admin: ${response.data.message || response.data.status}`);
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la suppression de l'admin");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleUpgradeToSuperAdmin = (id: number) => async () => {
    if (window.confirm("Êtes-vous sûr de vouloir promouvoir cet admin ?")) {
      try {
        setIsLoading(true);
        const response = await upgradeToSuperAdmin(id);
        console.log("Upgrade response", response);
        if (response.data.status === 200) {
          toast.success("Admin promu avec succès");
          await fetchAdmins();
        } else {
          toast.error(`Erreur lors de la promotion de l'admin: ${response.data.message || response.data.status}`);
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la promotion de l'admin");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleDowngradeToAdmin = (id: number) => async() => {
    if (window.confirm("Êtes-vous sûr de vouloir rétrograder cet admin ?")) {
      try {
        setIsLoading(true);
        const response = await downgradeToAdmin(id);
        if (response.data.status === 200) {
          toast.success("Admin rétrogradé avec succès");
          await fetchAdmins();
        } else {
          toast.error(`Erreur lors de la rétrogradation de l'admin: ${response.data.message || response.data.status}`);
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la rétrogradation de l'admin");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleEditClick = (admin: IAdmin) => {
    setAdminToEdit(admin);
    onEditModalOpen();
  };

  // Memos and filters
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredAdmin = [...admins];

    if (hasSearchFilter) {
      filteredAdmin = filteredAdmin.filter(
        (admin) =>
          admin.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          admin.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    const statusFilterArray = Array.from(statusFilter);
    if (statusFilterArray.length > 0 && !statusFilterArray.includes("ALL")) {
      filteredAdmin = filteredAdmin.filter((admin) =>
        statusFilterArray.includes(admin.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN")
      );
    }

    return filteredAdmin;
  }, [admins, hasSearchFilter, statusFilter, filterValue]);

  const statusCounts = useMemo(() => {
    const counts = { ALL: 0, ADMIN: 0, SUPER_ADMIN: 0 };
    admins.forEach((admin: IAdmin) => {
      counts[admin.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN" as keyof typeof counts]++;
    });
    counts.ALL = admins.length;
    return counts;
  }, [admins]);

  // Sort filtered items
  const sortedFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a: IAdmin, b: IAdmin) => {
      const column = sortDescriptor.column as keyof IAdmin;
      let first = a[column];
      let second = b[column];

      if (typeof first === 'string' && typeof second === 'string') {
        first = first.toLowerCase();
        second = second.toLowerCase();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedFilteredItems.length / ROWS_PER_PAGE);

  // Apply pagination to sorted items
  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return sortedFilteredItems.slice(start, end);
  }, [page, sortedFilteredItems]);

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
      if (status === "ALL") {
        if (statusFilter instanceof Set && statusFilter.has("ALL")) {
          setStatusFilter(new Set([]));
        } else {
          setStatusFilter(new Set(["ALL"]));
        }
      } else {
        const newStatusFilter = new Set(statusFilter);
        newStatusFilter.delete("ALL");

        if (newStatusFilter.has(status)) {
          newStatusFilter.delete(status);
        } else {
          newStatusFilter.add(status);
        }

        if (newStatusFilter.size === 0) {
          newStatusFilter.add("ALL");
        }

        setStatusFilter(newStatusFilter);
      }
      setPage(1);
    },
    [statusFilter]
  );

  // Effects
  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        await fetchAdmins();
      } catch (error) {
        toast.error("Erreur lors du chargement des administrateurs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("q");
    if (queryValue) {
      setFilterValue(queryValue);
      setStatusFilter(new Set(["ALL"]));
    }
  }, [location]);

  // Render cell content
  const renderCell = useCallback(
    (admin: IAdmin, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "id":
          return <p className="line-clamp-1 text-xs">#{admin.id}</p>;
        case "name":
          return <p className="line-clamp-1 text-xs">{admin.name}</p>;
        case "username":
          return <p className="line-clamp-1 text-xs">{admin.username}</p>;
        case "isSuperAdmin":
          return (
            <Chip
              className="!text-[10px]"
              color={statusColorMap[admin.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"]}
              size="sm"
              variant="dot"
            >
              {formatAdminRole(admin.isSuperAdmin)}
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
                <DropdownMenu>
                  <DropdownItem
                    endContent={<i className="fa-solid fa-pen text-blue-500"></i>}
                    key="edit"
                    onPress={() => handleEditClick(admin)}
                  >
                    <span className="!font-montserrat text-xs">Modifier</span>
                  </DropdownItem>
                  
                  {(role === 'ADM' && admin.isSuperAdmin) ? (
                    <>
                      <DropdownItem
                        endContent={<i className="fa-solid fa-arrow-down text-red-500"></i>}
                        key="downgrade"
                        onPress={handleDowngradeToAdmin(admin.id)}
                      >
                        <span className="!font-montserrat text-xs">Rétrograder</span>
                      </DropdownItem>
                      <DropdownItem
                        endContent={<i className="fa-solid fa-trash text-red-500"></i>}
                        key="delete"
                        className="text-danger"
                        onPress={handleDeleteAdmin(admin.id)}
                      >
                        <span className="!font-montserrat text-xs">Supprimer</span>
                      </DropdownItem>
                    </>
                  ) : null}
                  
                  {(role === 'ADM' && !admin.isSuperAdmin) ? (
                    <>
                      <DropdownItem
                        endContent={<i className="fa-solid fa-arrow-up text-green-500"></i>}
                        key="upgrade"
                        onPress={handleUpgradeToSuperAdmin(admin.id)}
                      >
                        <span className="!font-montserrat text-xs">Promouvoir</span>
                      </DropdownItem>
                      <DropdownItem
                        endContent={<i className="fa-solid fa-trash text-red-500"></i>}
                        key="delete"
                        className="text-danger"
                        onPress={handleDeleteAdmin(admin.id)}
                      >
                        <span className="!font-montserrat text-xs">Supprimer</span>
                      </DropdownItem>
                    </>
                  ) : null}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [role, handleDeleteAdmin, handleUpgradeToSuperAdmin, handleDowngradeToAdmin]
  );

  // Table components
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-start">
          <Input
            isClearable
            className="max-w-[350px]"
            placeholder="Rechercher..."
            description={
              <div className="line-clamp-1">Nom, Nom d'utilisateur</div>
            }
            startContent={<i className="fa-regular fa-search"></i>}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              base: "!bg-slate-100 w-full",
              inputWrapper: "!bg-white",
              input: "placeholder:!text-xs text-xs",
            }}
          />

          {/* filters - mobile */}
          <div className="flex md:hidden gap-3">
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
                {STATUS_OPTIONS.map((status) => (
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
            {STATUS_OPTIONS.map((status) => (
              <Button
                key={status.uid}
                className="text-[10px]"
                onPress={() => handleStatusFilter(status.uid)}
                color={
                  statusFilter instanceof Set && statusFilter.has(status.uid)
                    ? statusColorMap[status.uid] || "primary"
                    : "default"
                }
                radius="full"
                size="sm"
              >
                {status.name} (
                {statusCounts[status.uid as keyof typeof statusCounts]})
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-sm">Administrateurs</h2>
          <div className="flex items-center gap-3">
            <Button
              color="primary"
              size="sm"
              onPress={onOpen}
            >
              <i className="fa-solid fa-plus mr-2"></i> Ajouter
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-default-400 text-xs">
              {filteredItems.length} résultat
              {filteredItems.length > 1 ? "s" : ""}
            </span>
            <Tooltip
              content="Actualiser la liste"
              placement="top"
              showArrow
              classNames={{
                content: "!text-xs !font-[Montserrat] !bg-white",
              }}
            >
              <Button
                color="primary"
                size="sm"
                isIconOnly
                isLoading={loading}
                onPress={async () => {
                  setIsLoading(true);
                  try {
                    await fetchAdmins();
                  } finally {
                    setIsLoading(false);
                  }
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
    filteredItems.length,
    onClear,
    statusCounts,
    handleStatusFilter,
    fetchAdmins,
    loading,
    onOpen,
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
        <div className="ml-4 text-xs text-gray-500">
          Page {page} sur {pages || 1}
        </div>
      </div>
    );
  }, [page, pages]);

  return (
    <>
      <Table
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          emptyWrapper: "h-[493px] overflow-y-auto",
          loadingWrapper: "h-[493px] overflow-y-auto",
          tr: "cursor-pointer hover:bg-gray-50",
          th: "bg-gray-100 text-xs font-semibold",
        }}
        aria-labelledby="admins-table"
        selectionMode="single"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={(keys) => {
          if (keys === "all" || Array.from(keys).length === 0) {
            clearSelectedAdmin();
          } else {
            const selectedKey = Array.from(keys)[0] as string;
            const selectedAdmin = admins.find(
              (admin) => admin.id.toString() === selectedKey
            );
            if (selectedAdmin) {
              setSelectedAdmin(selectedAdmin);
            }
          }
          setSelectedKeys(keys);
        }}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              className="text-xs"
            >
              {column.name}
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
            <div className="flex flex-col justify-center items-center py-8">
              <i className="fa-duotone fa-warning text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Aucun administrateur trouvé</p>
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

      {/* Add Admin Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Ajouter un administrateur</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <AdminForm
              onSubmit={async (newAdminData: INewAdmin) => {
                await onAddAdmin(newAdminData);
                onClose();
              }}
              submitText="Ajouter"
            />
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && adminToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Modifier l'administrateur</h2>
              <button onClick={onEditModalClose} className="text-gray-500 hover:text-gray-700">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <AdminForm
              initialData={adminToEdit}
              onSubmit={handleEditAdmin(adminToEdit.id)}
              submitText="Enregistrer"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminList;