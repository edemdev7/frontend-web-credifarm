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
  import { IRegion, INewRegion } from "../../../../components/types/region";
  import { useRegionListStore } from "../../../../store/Admin/regionListStore";
  import toast from "react-hot-toast";
  import { 
    addRegion, 
    deleteRegion, 
    editRegion, 
  } from "../../../../api/services/admin/adminService";
  import { RegionForm } from './Form';
  
  // Constants
  const ROWS_PER_PAGE = 8;
  
  const statusColorMap: Record<string, ChipProps["color"]> = {
    ADMIN: "primary",
    SUPER_ADMIN: "success",
  };
  
  const COLUMNS = [
    { name: "ID", uid: "id" },
    { name: "Nom", uid: "nom", sortable: true },
    { name: "Département", uid: "departement" },
    { name: "Actions", uid: "actions" },
  ];
  
  const STATUS_OPTIONS = [
    { name: "Tous", uid: "ALL" },
    { name: "Region", uid: "ADMIN" },
    { name: "Super Region", uid: "SUPER_ADMIN" },
  ];
  
  const RegionList: FC = () => {
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
  
    // Selected region for editing
    const [regionToEdit, setRegionToEdit] = useState<IRegion | null>(null);
    // Vue détaillée
    const [regionToView, setRegionToView] = useState<IRegion | null>(null);
    const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();
    const { setSelectedRegion, clearSelectedRegion, fetchRegions, regions, addRegion, editRegion, removeRegion } = useRegionListStore();
  
    // CRUD handlers
    const onAddRegion = async (newRegionData: INewRegion) => {
      try {
        setIsLoading(true);
        await addRegion({ nom: newRegionData.nom, departementId: newRegionData.departementId });
        toast.success("Région ajoutée avec succès");
      } catch (error) {
        toast.error("Erreur lors de l'ajout de la région");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleEditRegion = (id: number) => async (updatedRegionData: INewRegion ) => {
      try {
        setIsLoading(true);
        await editRegion(id, { nom: updatedRegionData.nom, departementId: updatedRegionData.departementId });
        toast.success("Région modifiée avec succès");
        onEditModalClose();
      } catch (error) {
        toast.error("Erreur lors de la modification de la région");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDeleteRegion = (id: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette région ?")) {
        try {
          setIsLoading(true);
          await removeRegion(id);
          toast.success("Région supprimée avec succès");
        } catch (error) {
          toast.error("Erreur lors de la suppression de la région");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
  
    const handleEditClick = (region: IRegion) => {
      setRegionToEdit(region);
      onEditModalOpen();
    };
  
    const handleViewClick = (region: IRegion) => {
      setRegionToView(region);
      onViewModalOpen();
    };
  
    // Memos and filters
    const hasSearchFilter = Boolean(filterValue);
  
    const filteredItems = useMemo(() => {
      let filteredRegion = [...regions];
  
      if (hasSearchFilter) {
        filteredRegion = filteredRegion.filter(
          (region) =>
            region.nom.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
  
  
      return filteredRegion;
    }, [regions, hasSearchFilter, statusFilter, filterValue]);

  
    // Sort filtered items
    const sortedFilteredItems = useMemo(() => {
      return [...filteredItems].sort((a: IRegion, b: IRegion) => {
        const column = sortDescriptor.column as keyof IRegion;
        let first = a[column];
        let second = b[column];
  
        first = (first ?? '').toString().toLowerCase();
        second = (second ?? '').toString().toLowerCase();
  
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
      const loadRegions = async () => {
        setIsLoading(true);
        try {
          await fetchRegions();
        } catch (error) {
          toast.error("Erreur lors du chargement des regions");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadRegions();
    }, [fetchRegions]);
  
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
      (region: IRegion, columnKey: Key): ReactNode => {
        switch (columnKey) {
          case "id":
            return <p className="line-clamp-1 text-xs">#{region.id}</p>;
          case "nom":
            return <p className="line-clamp-1 text-xs">{region.nom}</p>;
          case "departement":
            return <p className="line-clamp-1 text-xs">{region.departement?.nom || ''}</p>;
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
                      endContent={<i className="fa-solid fa-eye text-green-500"></i>}
                      key="view"
                      onPress={() => handleViewClick(region)}
                    >
                      <span className="!font-montserrat text-xs">Voir</span>
                    </DropdownItem>
                    <DropdownItem
                      endContent={<i className="fa-solid fa-pen text-blue-500"></i>}
                      key="edit"
                      onPress={() => handleEditClick(region)}
                    >
                      <span className="!font-montserrat text-xs">Modifier</span>
                    </DropdownItem>
                    <DropdownItem
                        endContent={<i className="fa-solid fa-trash text-red-500"></i>}
                        key="delete"
                        className="text-danger"
                        onPress={handleDeleteRegion(region.id)}
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
      [role, handleDeleteRegion, handleEditClick, handleViewClick]
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
            <h2 className="font-bold text-sm">Regions</h2>
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
                      await fetchRegions();
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
      fetchRegions,
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
          aria-labelledby="regions-table"
          selectionMode="single"
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={(keys) => {
            if (keys === "all" || Array.from(keys).length === 0) {
              clearSelectedRegion();
            } else {
              const selectedKey = Array.from(keys)[0] as string;
              const selectedRegion = regions.find(
                (region) => region.id.toString() === selectedKey
              );
              if (selectedRegion) {
                setSelectedRegion(selectedRegion);
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
                <p className="text-gray-500">Aucune region trouvée</p>
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
  
        {/* Add Region Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Ajouter une region</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <RegionForm
                onSubmit={async (newRegionData: INewRegion) => {
                  await onAddRegion(newRegionData);
                  onClose();
                }}
                submitText="Ajouter"
              />
            </div>
          </div>
        )}
  
        {/* Edit Region Modal */}
        {isEditModalOpen && regionToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Modifier la region</h2>
                <button onClick={onEditModalClose} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <RegionForm
                initialData={regionToEdit}
                onSubmit={handleEditRegion(regionToEdit.id)}
                submitText="Enregistrer"
              />
            </div>
          </div>
        )}
  
        {/* View Region Modal */}
        {isViewModalOpen && regionToView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Détails de la région</h2>
                <button onClick={onViewModalClose} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="space-y-2">
                <div><b>ID :</b> {regionToView.id}</div>
                <div><b>Nom :</b> {regionToView.nom}</div>
                <div><b>Département :</b> {regionToView.departement?.nom}</div>
                <div><b>Utilisateurs :</b> {regionToView.users?.length ?? 0}</div>
                <div><b>Bassins :</b> {regionToView.bassins?.length ?? 0}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default RegionList;