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
  import { IDepartment, INewDepartment } from "../../../../components/types/department";
  import { useDepartmentListStore } from "../../../../store/Admin/departmentListStore";
  import toast from "react-hot-toast";
  import { 
    addDepartment, 
    deleteDepartment, 
    editDepartment, 
  } from "../../../../api/services/admin/adminService";
  import { DepartmentForm } from './Form';
  
  // Constants
  const ROWS_PER_PAGE = 8;
  
  const statusColorMap: Record<string, ChipProps["color"]> = {
    ADMIN: "primary",
    SUPER_ADMIN: "success",
  };
  
  const COLUMNS = [
    { name: "ID", uid: "id" },
    { name: "Département", uid: "name", sortable: true },
    { name: "Nombre de régions", uid: "regionsCount" },
    { name: "Actions", uid: "actions" },
  ];

  
  const DepartmentList: FC = () => {
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
  
    // Selected department for editing
    const [departmentToEdit, setDepartmentToEdit] = useState<IDepartment | null>(null);
  
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();
    const { setSelectedDepartment, clearSelectedDepartment, fetchDepartments, departments, addDepartment, editDepartment, removeDepartment } = useDepartmentListStore();
  
    // CRUD handlers
    const onAddDepartment = async (newDepartmentData: INewDepartment) => {
      try {
        setIsLoading(true);
        await addDepartment({ nom: newDepartmentData.name });
        toast.success("Département ajouté avec succès");
      } catch (error) {
        toast.error("Erreur lors de l'ajout du département");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleEditDepartment = (id: number) => async (updatedDepartmentData: INewDepartment ) => {
      try {
        setIsLoading(true);
        await editDepartment(id, { nom: updatedDepartmentData.name });
        toast.success("Département modifié avec succès");
        onEditModalClose();
      } catch (error) {
        toast.error("Erreur lors de la modification du département");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDeleteDepartment = (id: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
        try {
          setIsLoading(true);
          await removeDepartment(id);
          toast.success("Département supprimé avec succès");
        } catch (error) {
          toast.error("Erreur lors de la suppression du département");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
  
    const handleEditClick = (department: IDepartment) => {
      setDepartmentToEdit(department);
      onEditModalOpen();
    };
  
    // Memos and filters
    const hasSearchFilter = Boolean(filterValue);
  
    const filteredItems = useMemo(() => {
      let filteredDepartment = [...departments];
  
      if (hasSearchFilter) {
        filteredDepartment = filteredDepartment.filter(
          (department) =>
            department.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            (department.regions && department.regions.some(r => r.nom.toLowerCase().includes(filterValue.toLowerCase())))
        );
      }
  
  
      return filteredDepartment;
    }, [departments, hasSearchFilter, statusFilter, filterValue]);

  
    // Sort filtered items
    const sortedFilteredItems = useMemo(() => {
      return [...filteredItems].sort((a: IDepartment, b: IDepartment) => {
        const column = sortDescriptor.column as keyof IDepartment;
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
      const loadDepartments = async () => {
        setIsLoading(true);
        try {
          await fetchDepartments();
        } catch (error) {
          toast.error("Erreur lors du chargement des departments");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDepartments();
    }, [fetchDepartments]);
  
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
      (department: IDepartment, columnKey: Key): ReactNode => {
        switch (columnKey) {
          case "id":
            return <p className="line-clamp-1 text-xs">#{department.id}</p>;
          case "name":
            return <p className="line-clamp-1 text-xs">{department.name}</p>;
          case "regionsCount":
            return <p className="line-clamp-1 text-xs">{department.regions ? department.regions.length : 0}</p>;
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
                      onPress={() => handleEditClick(department)}
                    >
                      <span className="!font-montserrat text-xs">Modifier</span>
                    </DropdownItem>
                    <DropdownItem
                        endContent={<i className="fa-solid fa-trash text-red-500"></i>}
                        key="delete"
                        className="text-danger"
                        onPress={handleDeleteDepartment(department.id)}
                    >
                        <span className="!font-montserrat text-xs">Supprimer</span>
                    </DropdownItem>
                    
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          default:
            return null;
        }
      },
      [role, handleDeleteDepartment, handleEditClick]
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
  

          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm">Les Departements</h2>
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
                      await fetchDepartments();
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
      handleStatusFilter,
      fetchDepartments,
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
          aria-labelledby="departments-table"
          selectionMode="single"
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={(keys) => {
            if (keys === "all" || Array.from(keys).length === 0) {
              clearSelectedDepartment();
            } else {
              const selectedKey = Array.from(keys)[0] as string;
              const selectedDepartment = departments.find(
                (department) => department.id.toString() === selectedKey
              );
              if (selectedDepartment) {
                setSelectedDepartment(selectedDepartment);
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
                <p className="text-gray-500">Aucun department  trouvé</p>
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
  
        {/* Add Department Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Ajouter une department</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <DepartmentForm
                onSubmit={async (newDepartmentData: INewDepartment) => {
                  await onAddDepartment(newDepartmentData);
                  onClose();
                }}
                submitText="Ajouter"
              />
            </div>
          </div>
        )}
  
        {/* Edit Department Modal */}
        {isEditModalOpen && departmentToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Modifier la department</h2>
                <button onClick={onEditModalClose} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <DepartmentForm
                initialData={departmentToEdit}
                onSubmit={handleEditDepartment(departmentToEdit.id)}
                submitText="Enregistrer"
              />
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default DepartmentList;