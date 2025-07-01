import { FC, Key, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  Select, SelectItem
} from "@heroui/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { IMember, cancelMembership, addMember } from "../../api/services/cooperative/memberService";
import { useMemberStore } from "../../store/memberStore";
import { capitalize, formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import * as Enums from '../../utils/enums'
import { fetchRegions } from "../../api/regions";
import { fetchDepartments } from "../../api/department";

const role = localStorage.getItem("accessToken")?.substring(0,3);

// Constants
const ROWS_PER_PAGE = role == 'COO'? 10 : 8;

const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
  INACTIVE: "warning",
  ACTIVE: "primary",
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Pisciculteur", uid: "farmerName", sortable: true },
  { name: "Region", uid: "region", sortable: true },
  { name: "Departement", uid: "department" },
  { name: "Membre depuis", uid: "joinedCooperativeAt" },
  { name: "Statut", uid: "status" },
  { name: "Actions", uid: "actions" }
];

const STATUS_OPTIONS = [
  { name: "Tout", uid: "ALL" },
  { name: "Actif", uid: "ACTIVE" },
  { name: "Inactif", uid: "INACTIVE" },
];

const GENDER_OPTIONS = [
  { value: 1, label: "Homme" },
  { value: 0, label: "Femme" },
];

interface AddMemberFormData {
  name: string;
  region: string;
  department: string;
  village: string;
  gender: boolean;
}

const MemberList: FC = () => {
  // States
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["ALL"]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "farmerName",
    direction: "ascending"
  });
  const [page, setPage] = useState(1);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [regions, setRegions] = useState<{ id: number; name: string }[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
  
  const { isOpen: isAddMemberModalOpen, onOpen: onAddMemberModalOpen, onClose: onAddMemberModalClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // React Hook Form setup
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch 
  } = useForm<AddMemberFormData>({
    defaultValues: {
      name: "",
      region: "",
      department: ""
    }
  });
  
  const selectedRegion = watch("region");

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isMemberDateOpen, onOpen: onMemberDateOpen } = useDisclosure();

  const {
    setSelectedMember,
    clearSelectedMember,
    fetchMembers,
    members
  } = useMemberStore();

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegionsData = async () => {
      try {
        const REGIONS = await fetchRegions();
        setRegions(REGIONS);
      } catch (error) {
        console.error("Error fetching regions:", error);
        toast.error("Erreur lors du chargement des régions");
      }
    };
    fetchRegionsData();
  }, []);

  // Fetch departments when region changes
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      if (!selectedRegion) return;
      
      setIsLoadingDepartments(true);
      try {
        const deps = await fetchDepartments(Number(selectedRegion));
        setDepartments(deps);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Erreur lors du chargement des départements");
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    
    fetchDepartmentsData();
  }, [selectedRegion]);

  const onAddMember = async (data: AddMemberFormData) => {
    setIsSubmitting(true);
    try {
      const response = await addMember({
        name: data.name,
        region: data.region,
        department: data.department,
        village: data.village,
        gender: Boolean(data.gender),
      });
      
      if (response.status === 201) {
        toast.success("Pisciculteur ajouté avec succès");
        await fetchMembers();
        reset();
        onAddMemberModalClose();
      } else {
        toast.error(`Erreur lors de l'ajout du pisciculteur: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Une erreur est survenue lors de l'ajout du pisciculteur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelMembership = (member: IMember) => async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${member.name} de la liste de vos membres ?`)) {
      try {
        const response = await cancelMembership(member.id);
        
        if (response.status === 201) {
          toast.success("Adhésion annulée avec succès");
          await fetchMembers();
        } else {
          toast.error(`Erreur lors de l'annulation de l'adhésion: ${response.status}`);
        }
      } catch (error) {
        console.error("Error cancelling membership:", error);
        toast.error("Une erreur est survenue lors de l'annulation de l'adhésion");
      }
    }
  };

  // Memos
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredMembers = [...members];

    if (hasSearchFilter) {
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          member.region.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          member.id.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (dateRange) {
      filteredMembers = filteredMembers.filter((member) => {
        const memberDate = new Date(member.joinedCooperativeAt);
        return (
          memberDate >= dateRange.start.toDate(getLocalTimeZone()) &&
          memberDate <= dateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    return filteredMembers;
  }, [members, hasSearchFilter, filterValue, dateRange]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: IMember, b: IMember) => {
      const first = a[sortDescriptor.column as keyof IMember];
      const second = b[sortDescriptor.column as keyof IMember];

      if (sortDescriptor.column === "joinedCooperativeAt") {
        return sortDescriptor.direction === "descending"
          ? new Date(second as string).getTime() - new Date(first as string).getTime()
          : new Date(first as string).getTime() - new Date(second as string).getTime();
      }

      if (first === null || second === null) {
        return 0;
      }
      
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedItems.length / ROWS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return sortedItems.slice(start, end);
  }, [page, sortedItems]);

  // Handlers
  const handleSearch = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setStatusFilter(new Set(["ALL"]));
      setPage(1);
    } else {
      setFilterValue("");
      setStatusFilter(new Set(["ALL"]));
    }
  }, []);

  const handleClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleColumnClick = (columnId: string) => {
    if (columnId === "joinedCooperativeAt") {
      onMemberDateOpen();
    }
  };

  const handleModalClose = () => {
    reset();
    onAddMemberModalClose();
  };

  const renderCell = useCallback(
    (member: IMember, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "id":
          return <p className="line-clamp-1 text-xs">{member.id}</p>;
        case "farmerName":
          return <p className="line-clamp-1 text-xs">{member.name}</p>;
        case "region":
          return <p className="line-clamp-1 text-xs">{member.region.name}</p>;
        case "department":
          return <p className="line-clamp-1 text-xs">{member.department.name}</p>;
        case "joinedCooperativeAt":
          return (
            <p className="line-clamp-1 text-xs">
              {member.joinedCooperativeAt ? formatDate(new Date(member.joinedCooperativeAt).toISOString()) : "---"}
            </p>
          );
        case "status":
          return (
            <Chip
              color={STATUS_COLOR_MAP[member.phone? 'ACTIVE': 'INACTIVE']}
              size="sm"
              className="!font-montserrat"
            >
              {capitalize(member.phone ? 'ACTIF' : 'INACTIF')}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2 !font-montserrat">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <i className="fa-solid fa-ellipsis-vertical text-gray-500" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {role === 'ADM' ? (
                    <>
                      <DropdownItem
                        key="view"
                        endContent={<i className="fa-solid fa-eye text-primary" />}
                        // onPress={() => navigate(`/admin/members/${member.id}`)}
                      >
                        <span className="!font-montserrat text-xs">Voir details</span>
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        endContent={<i className="fa-solid fa-pencil text-primary" />}
                        // onPress={() => navigate(`/admin/members/${member.id}`)}
                      >
                        <span className="!font-montserrat text-xs">Modifier</span>
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        endContent={<i className="fa-solid fa-trash text-danger" />}
                        // onPress={() => navigate(`/admin/members/${member.id}`)}
                      >
                        <span className="!font-montserrat text-xs">Suprimer</span>
                      </DropdownItem>
                    </>
                  ) : (
                    <DropdownItem
                    key="cancel"
                    endContent={<i className="fa-solid fa-times text-red-500" />}
                    onPress={handleCancelMembership(member)}
                  >
                    <span className="!font-montserrat text-xs">Annuler l'adhésion</span>
                  </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [navigate, handleCancelMembership]
  );

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMembers();
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Erreur lors du chargement des membres");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchMembers]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("q");
    if (queryValue) {
      setFilterValue(queryValue);
      setStatusFilter(new Set(["ALL"]));
    }
  }, [location]);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <Input
          isClearable
          className="max-w-[350px]"
          placeholder="Rechercher..."
          description={<div className="line-clamp-1">Producteur, Région...</div>}
          startContent={<i className="fa-regular fa-search" />}
          value={filterValue}
          onClear={handleClear}
          onValueChange={handleSearch}
          classNames={{
            base: "!bg-slate-100 w-full",
            inputWrapper: "!bg-white",
            input: "placeholder:!text-xs text-xs"
          }}
        />

        <Button
          color="primary"
          size="sm"
          onPress={onAddMemberModalOpen}
          className="sm:flex sm:items-center sm:gap-2"
        >
          <span className="hidden sm:inline">{role == 'COO'? `Ajouter un membre`: `Ajouter un pisciculteur`}</span>
          <i className="fa-regular fa-plus sm:hidden"></i>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold ~text-sm/base">{role === 'COO' ? `Liste des Membres de la coopérative`: `Liste de Pisciculteurs`}</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-default-400">
            {filteredItems.length} résultat{filteredItems.length > 1 ? "s" : ""}
          </span>
          <Tooltip
            content="Rafraîchir la liste"
            placement="top"
            showArrow
            classNames={{
              content: "!text-xs !font-[Montserrat] !bg-white"
            }}
          >
            <Button
              color="primary"
              size="sm"
              isIconOnly
              onPress={async () => {
                setIsLoading(true);
                try {
                  await fetchMembers();
                } catch (error) {
                  toast.error("Erreur lors du rafraîchissement de la liste");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <i className="fa-solid fa-arrows-rotate" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ), [
    filterValue,
    handleSearch,
    filteredItems.length,
    handleClear,
    fetchMembers,
    onAddMemberModalOpen
  ]);

  const bottomContent = useMemo(() => (
    <div className="flex items-center justify-center px-2 py-2">
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
          next: "bg-white"
        }}
      />
    </div>
  ), [page, pages]);

  return (
    <>
      <Table
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          emptyWrapper: "h-[493px] overflow-y-auto",
          loadingWrapper: "h-[493px] overflow-y-auto",
          tr: "cursor-pointer"
        }}
        aria-label="Liste des membres"
        selectionMode="single"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={(keys) => {
          if (keys === "all" || Array.from(keys).length === 0) {
            clearSelectedMember();
          } else {
            const selectedKey = Array.from(keys)[0] as string;
            const selectedMember = members.find(
              (member) => member.id.toString() === selectedKey
            );
            if (selectedMember) {
              setSelectedMember(selectedMember);
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
              className={column.uid === "joinedCooperativeAt" ? "hover:text-zinc-400 group" : undefined}
              onClick={() => handleColumnClick(column.uid)}
            >
              {column.name}
              {column.uid === "joinedCooperativeAt" && (
                <i className="ml-3 fa-regular fa-filter text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
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
            <div className="flex flex-col items-center justify-center">
              <i className="fa-duotone fa-info-circle" />
              <p>Aucun membre trouvé</p>
            </div>
          }
          items={paginatedItems}
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

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={handleModalClose}
        placement="center"
        classNames={{
          base: "bg-white shadow-lg rounded-lg"
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-800 mb-4"
            >
              {role == 'COO'? `Ajouter un membre inactif` : `Ajouter un pisciculteur`}
            </motion.h1>
          </ModalHeader>
          <ModalBody>
            <form id="addMemberForm" onSubmit={handleSubmit(onAddMember)} className="space-y-4">
              <div>
                <Input
                  label="Nom du pisciculteur"
                  placeholder="Entrez le nom du pisciculteur"
                  {...register("name", { required: "Le nom est requis" })}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  fullWidth
                  className="w-full"
                />
              </div>
              
              <div>
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: "La région est requise" }}
                  render={({ field }) => (
                    <Select
                      label="Région"
                      placeholder="Sélectionnez la région"
                      selectedKeys={field.value ? [field.value] : []}
                      isInvalid={!!errors.region}
                      errorMessage={errors.region?.message}
                      className="w-full"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        // Reset department when region changes
                        setValue("department", "");
                      }}
                    >
                      {regions.map((region) => (
                        <SelectItem key={region.id.toString()} value={region.id.toString()}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              
              <div>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: "Le département est requis" }}
                  render={({ field }) => (
                    <Select
                      label="Département"
                      placeholder={
                        isLoadingDepartments 
                          ? "Chargement des départements..." 
                          : !selectedRegion 
                            ? "Sélectionnez d'abord une région" 
                            : "Sélectionnez le département"
                      }
                      selectedKeys={field.value ? [field.value] : []}
                      isDisabled={!selectedRegion || isLoadingDepartments}
                      isInvalid={!!errors.department}
                      errorMessage={errors.department?.message}
                      className="w-full"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {departments.map((department) => (
                        <SelectItem key={department.id.toString()} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div>
                <Input
                  label="Village"
                  placeholder="Entrez le village"
                  {...register("village", { required: "Le village est requis" })}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  fullWidth
                  className="w-full"
                />
              </div>
              <div>
                <Select
                  label="Genre"
                  placeholder="Sélectionnez votre genre"
                  {...register("gender", { required: "Le genre est requis!" })}
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender?.message}
                  fullWidth
                  className="w-full"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
              size="sm"
              onPress={handleModalClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="addMemberForm"
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MemberList;