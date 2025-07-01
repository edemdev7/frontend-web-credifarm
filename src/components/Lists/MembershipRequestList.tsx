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
  useDisclosure
} from "@heroui/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { IMembershipRequest, acceptMembershipRequest, rejectMembershipRequest } from "../../api/services/cooperative/membershipRequestService";
import { useMembershipRequestStore } from "../../store/membershipRequestnStore";
import { capitalize, formatDate, formatMembershipRequestStatus } from "../../utils/formatters";
import toast from "react-hot-toast";
// Constants
const ROWS_PER_PAGE = 10;

const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
  PENDING: "warning",
  // ACCEPTED: "primary",
  REJECTED: "danger",
  PAID: "success"
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Producteur", uid: "farmerName", sortable: true },
  { name: "Region", uid: "region", sortable: true },
  { name: "Departement", uid: "department" },
  { name: "Date de demande", uid: "requestDate" },
  { name: "Statut", uid: "status" },
  { name: "Actions", uid: "actions" }
];

const STATUS_OPTIONS = [
  { name: "Tout", uid: "ALL" },
  { name: "En attente", uid: "PENDING" },
  // { name: "Approuve", uid: "ACCEPTED" },
  { name: "Rejete", uid: "REJECTED" },
];

const MembershipRequestList: FC = () => {
  // States
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["ALL"]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "farmerName",
    direction: "ascending"
  });
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false)

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isMembershipRequestDateOpen, onOpen: onMembershipRequestDateOpen } = useDisclosure();

  const {
    setSelectedMembershipRequest,
    clearSelectedMembershipRequest,
    fetchMembershipRequests,
    membershipRequests
  } = useMembershipRequestStore();

  const handleAcceptMembershipRequest = (id: number) => async () => {
    if (window.confirm("Êtes-vous sûr de vouloir accepter cette demande d'adhésion ?")) {
      const response = await acceptMembershipRequest(id);
      console.log('status', response.status);
      if (response.status === 201) {
      toast.success("Demande d'adhésion acceptée avec succès");
      await fetchMembershipRequests();
      } else {
      toast.error(`Erreur lors de l'acceptation de la demande d'adhésion${response.status}`);
      }
    }
  }

  const handleRejectMembershipRequest = (id: number) => async () => {
    if (window.confirm("Êtes-vous sûr de vouloir refuser cette demande d'adhésion ?")) {
      const response = await rejectMembershipRequest(id);
      if (response.status === 201) {
        toast.success("Demande d'adhésion rejetée avec succès");
        await fetchMembershipRequests();
      }else{
        toast.error(`Erreur lors du rejet de la demande d'adhésion${response.status}`);
      }
    }
  }

  // Memos
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredRequests = [...membershipRequests];

    if (hasSearchFilter) {
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.farmer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          request.farmer.region.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          request.id.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    const statusFilterArray = Array.from(statusFilter);
    if (statusFilterArray.length > 0 && !statusFilterArray.includes("ALL")) {
      filteredRequests = filteredRequests.filter((request) =>
        statusFilterArray.includes(request.status)
      );
    }

    if (dateRange) {
      filteredRequests = filteredRequests.filter((request) => {
        const requestDate = new Date(request.requestDate);
        return (
          requestDate >= dateRange.start.toDate(getLocalTimeZone()) &&
          requestDate <= dateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    return filteredRequests;
  }, [membershipRequests, hasSearchFilter, statusFilter, filterValue, dateRange]);

  const statusCounts = useMemo(() => {
    const counts = { ALL: 0, PENDING: 0, REJECTED: 0, PAID: 0 };
    membershipRequests.forEach((request: IMembershipRequest) => {
      counts[request.status as keyof typeof counts]++;
    });
    counts.ALL = membershipRequests.length;
    return counts;
  }, [membershipRequests]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: IMembershipRequest, b: IMembershipRequest) => {
      const first = a[sortDescriptor.column as keyof IMembershipRequest];
      const second = b[sortDescriptor.column as keyof IMembershipRequest];

      if (sortDescriptor.column === "requestDate" || sortDescriptor.column === "updateDate") {
        return sortDescriptor.direction === "descending"
          ? new Date(second as string).getTime() - new Date(first as string).getTime()
          : new Date(first as string).getTime() - new Date(second as string).getTime();
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

  const handleStatusFilter = useCallback(
    (status: string) => {
      if (status === "ALL") {
        if (statusFilter instanceof Set && statusFilter.has("ALL")) {
          setStatusFilter(new Set([]));
        } else {
          setStatusFilter(new Set(["ALL"]));
        }
      } else {
        setStatusFilter((prev) => {
          const newFilter = new Set(prev);
          newFilter.delete("ALL");
          newFilter.has(status) ? newFilter.delete(status) : newFilter.add(status);
          return newFilter.size === 0 ? new Set(["ALL"]) : newFilter;
        });
      }
      setPage(1);
    },
    []
  );

  const handleColumnClick = (columnId: string) => {
    if (columnId === "requestDate") {
      onMembershipRequestDateOpen();
    }
  };

  const renderCell = useCallback(
    (request: IMembershipRequest, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "id":
          return <p className="line-clamp-1 text-xs">{request.id}</p>;
        case "farmerName":
          return <p className="line-clamp-1 text-xs">{request.farmer.name}</p>;
        case "region":
          return <p className="line-clamp-1 text-xs">{request.farmer.region.name}</p>;
        case "department":
          return <p className="line-clamp-1 text-xs">{request.farmer.department.name}</p>;
        case "requestDate":
          return (
            <p className="line-clamp-1 text-xs">
              {request.requestDate ? formatDate(new Date(request.requestDate).toISOString()) : "---"}
            </p>
          );
        case "status":
          return (
            <Chip
              className="!text-[10px]"
              color={STATUS_COLOR_MAP[request.status]}
              size="sm"
              variant="dot"
            >
              {formatMembershipRequestStatus(request.status)}
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
                  {request.status === "PENDING" ? (
                    <>
                      <DropdownItem
                        key="accept"
                        endContent={<i className="fa-solid fa-check text-green-500" />}
                        onPress={handleAcceptMembershipRequest(request.id)}
                      >
                        <span className="!font-montserrat text-xs">Accepter</span>
                      </DropdownItem>
                      <DropdownItem
                        key="reject"
                        endContent={<i className="fa-solid fa-times text-red-500" />}
                        onPress={handleRejectMembershipRequest(request.id)}
                      >
                        <span className="!font-montserrat text-xs">Refuser</span>
                      </DropdownItem>
                    </>
                  ): null}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [navigate]
  );

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchMembershipRequests();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchMembershipRequests]);

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
          placeholder="Search..."
          description={<div className="line-clamp-1">ID, Producteur, Region...</div>}
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

        {/* Mobile filters */}
        <div className="flex gap-3 md:hidden">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" className="shadow-sm">
                <i className="fa-regular fa-filter-list" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                setStatusFilter(keys);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  <span className="!font-[Montserrat] !text-xs font-semibold">
                    {capitalize(status.name)} ({statusCounts[status.uid as keyof typeof statusCounts]})
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Desktop filters */}
        <div className="hidden space-x-2 md:flex">
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status.uid}
              className="text-[10px]"
              onPress={() => handleStatusFilter(status.uid)}
              color={
                statusFilter instanceof Set && statusFilter.has(status.uid)
                  ? STATUS_COLOR_MAP[status.uid] || "primary"
                  : "default"
              }
              radius="full"
              size="sm"
            >
              {status.name} ({statusCounts[status.uid as keyof typeof statusCounts]})
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold ~text-sm/base">Demandes d'adhésion</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-default-400">
            {filteredItems.length} resultat{filteredItems.length > 1 && "s"}
          </span>
          <Tooltip
            content="Refresh List"
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
                await fetchMembershipRequests();
                setIsLoading(false);
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
    statusFilter,
    filteredItems.length,
    handleClear,
    statusCounts,
    handleStatusFilter,
    fetchMembershipRequests
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
    <Table
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        emptyWrapper: "h-[493px] overflow-y-auto",
        loadingWrapper: "h-[493px] overflow-y-auto",
        tr: "cursor-pointer"
      }}
      aria-label="Membership Requests Table"
      selectionMode="single"
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        if (keys === "all" || Array.from(keys).length === 0) {
          clearSelectedMembershipRequest();
        } else {
          const selectedKey = Array.from(keys)[0] as string;
          const selectedRequest = membershipRequests.find(
            (request) => request.id.toString() === selectedKey
          );
          if (selectedRequest) {
            setSelectedMembershipRequest(selectedRequest);
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
            className={column.uid === "requestDate" ? "hover:text-zinc-400 group" : undefined}
            onClick={() => handleColumnClick(column.uid)}
          >
            {column.name}
            {column.uid === "requestDate" && (
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
            <i className="fa-duotone fa-warning" />
            <p>Aucune demandes de credits</p>
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
  );
};

export default MembershipRequestList;