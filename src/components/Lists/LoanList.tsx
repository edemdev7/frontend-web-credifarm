import {
    Button,
    Chip,
    ChipProps,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    SelectItem,
    Select,
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
  import { ILoan, ILoanEvaluation, INewLoanEvaluation, acceptLoan, evaluateLoan, updateLoanEvaluation, cancelLoanEvaluation, rejectLoan, markLoanAsPaid, confirmLoan } from "../../api/services/cooperative/loanService";
  import { useLoanStore } from "../../store/loanStore";
  import {
    capitalize,
    formatDate,
    formatLoanStatus,
  } from "../../utils/formatters";
  import * as Enums from '../../utils/enums';
  import toast from "react-hot-toast";
  import { useForm, Controller } from "react-hook-form";
  import { motion } from "framer-motion";
  
  // Constants
  const rowsPerPage = 10;
  
  const statusColorMap: Record<string, ChipProps["color"]> = {
    PENDING: "warning",
    ACCEPTED: "primary",
    REJECTED: "danger",
    PAID: "success",
    EVALUATED: "primary",
  };

  
  const columns = [
    { name: "ID", uid: "id" },
    { name: "Pisciculteur", uid: "farmerName", sortable: true },
    { name: "Montant (XOF)", uid: "amount" },
    { name: "Date d'envoi", uid: "requestDate" },
    { name: "Score Pisciculteur", uid: "scoreRating", sortable: true },
    { name: "Statut", uid: "status" },
    { name: "Actions", uid: "actions" },
  ];
  
  const statusOptions = [
    { name: "Tout", uid: "ALL" },
    { name: "En attente", uid: "PENDING" },
    { name: "Accepté", uid: "ACCEPTED" },
    { name: "Refusé", uid: "REJECTED" },
    { name: "Remboursé", uid: "PAID" },
    { name: "Evalué", uid: "EVALUATED" },
  ];
  
  const LoanList: FC = () => {
    // States
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["ALL"]));
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "farmerName",
      direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [loading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
    const [role] = useState(localStorage.getItem("accessToken")?.substring(0, 3) || '');

    const { isOpen: isAddEvaluationModalOpen, onOpen: onAddEvaluationModalOpen, onClose: onAddEvaluationModalClose } = useDisclosure();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();
    const {
      onOpen: onLoanDateOpen,
      onOpenChange: onLoanDateOpenChange,
      isOpen: isLoanDateOpen,
    } = useDisclosure();

    const { 
        control, 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset,
        setValue,
        watch 
      } = useForm<INewLoanEvaluation | ILoanEvaluation>({
        defaultValues: {}
      });
  
  
    const { setSelectedLoan, clearSelectedLoan, fetchLoans, loans } = useLoanStore();

    const handleAcceptLoan = (loanId: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir accepter cette demande d'avance d'intrants ?")) {
        const response = await acceptLoan(loanId);
        if (response.data.status = 200) {
          toast.success('Demande d\'avance d\'intrants acceptée avec succès');
          await fetchLoans();
        } else {
          toast.error(`Erreur lors de l'acceptation de la demande d'avance d'intrants${response.data.status}`);
        }
      }
    }
  
    const handleRejectLoan = (loanId: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir refuser cette demande d'avance d'intrants ?")) {
        const response = await rejectLoan(loanId);
        if (response.data.status == 200) {
          toast.success('Demande d\'avance d\'intrants rejetée avec succès');
          await fetchLoans();
        } else {
          toast.error(`Erreur lors du rejet de la demande d'avance d'intrants${response.data.status}`);
        }
      }
    }
  
    const handleMarkAsPaid = (loanId: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir marquer cette demande de crédit comme étant payée ?")) {
        const response = await markLoanAsPaid(loanId);
        if (response.data.status == 200) {
          toast.success('Demande de credit marquée comme remboursée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors du marquage de la demande de crédit comme remboursée${response.data.status}`);
        }
      }
    }

    const handleConfirmLoan = (loanId: number) => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir confirmer cette demande de crédit ?")) {
        const response = await confirmLoan(loanId);
        console.log("Confirm Loan Response", response);
        if (response.data.status == 200) {
          toast.success('Demande de credit confirmée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors de la confirmation de la demande de crédit${response.data.status}`);
        }
      }
    }

    const onAddEvaluation = async (data: INewLoanEvaluation | ILoanEvaluation) => {
      setIsSubmitting(true);
      console.log('Add Evaluation Data', data);
      if (data.loanId == undefined) {
        toast.error('Loan ID is undefined');
        return;
      }
      try {
      const response = await evaluateLoan(data.loanId, data);
      console.log('Evaluation Response', response);
      if (response.data.status === 201) {
        toast.success('Évaluation de la demande de crédit effectuée avec succès');
        await fetchLoans();
        onAddEvaluationModalClose();
      } else {
        toast.error(`Erreur lors de l'évaluation de la demande de crédit: ${response.data.status}`);
      }
      } catch (error) {
      toast.error('Erreur lors de l\'évaluation de la demande de crédit');
      console.error('Evaluation Error', error);
      }
      setIsSubmitting(false);
    };

    const handleUpdateLoanEvaluation = () => async (data: ILoanEvaluation) => {
      const response = await updateLoanEvaluation(data);
      if (response.data.status == 200) {
        toast.success('Evaluation de la demande de credit mise à jour avec succès');
        await fetchLoans();
      }else{
        toast.error(`Erreur lors de la mise à jour de l\'évaluation de la demande de crédit${response.data.status}`);
      }
    }

    const handleCancelLoanEvaluation = (loanEvaluationId: number) => async () => {
      console.log('Loan Evaluation ID', loanEvaluationId);
      try {
      const response = await cancelLoanEvaluation(loanEvaluationId);
      if (response.data.status === 200) {
        toast.success('Évaluation de la demande de crédit annulée avec succès');
        await fetchLoans();
      } else {
        toast.error(`Erreur lors de l'annulation de l'évaluation de la demande de crédit: ${response.data.status}`);
      }
      } catch (error) {
      toast.error('Erreur lors de l\'annulation de l\'évaluation de la demande de crédit');
      console.error('Cancel Evaluation Error', error);
      }
    }

    const handleModalClose = () => {
      reset();
      onAddEvaluationModalClose();
    };
  
    // Memos
    const hasSearchFilter = Boolean(filterValue);
  
    const filteredItems = useMemo(() => {
      let filteredLoan = [...loans];
  
      if (hasSearchFilter) {
        filteredLoan = filteredLoan.filter(
          (loan) =>
            loan.farmer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            Enums.cropTypeEnum.find(crop => crop.value === loan.cropType)?.label ||
            loan.id.toString().toLowerCase().includes(filterValue.toLowerCase())
        );
      }
  
      const statusFilterArray = Array.from(statusFilter);
      if (statusFilterArray.length > 0 && !statusFilterArray.includes("ALL")) {
        filteredLoan = filteredLoan.filter((loan) =>
          statusFilterArray.includes(loan.status)
        );
      }
  
      if (dateRange) {
        filteredLoan = filteredLoan.filter((loan) => {
          const loanDate = new Date(loan.requestDate);
          return (
            loanDate >= dateRange.start.toDate(getLocalTimeZone()) &&
            loanDate <= dateRange.end.toDate(getLocalTimeZone())
          );
        });
      }
  
      return filteredLoan;
    }, [loans, hasSearchFilter, statusFilter, filterValue, dateRange]);
  
    const statusCounts = useMemo(() => {
      const counts = { ALL: 0, PENDING: 0, ACCEPTED: 0, REJECTED: 0, PAID: 0, EVALUATED: 0 };
      loans.forEach((loan: ILoan) => {
        counts[loan.status as keyof typeof counts]++;
      });
      counts.ALL = loans.length;
      return counts;
    }, [loans]);
  
    // Sort filtered items
    const sortedFilteredItems = useMemo(() => {
      return [...filteredItems].sort((a: ILoan, b: ILoan) => {
        let first = a[sortDescriptor.column as keyof ILoan];
        let second = b[sortDescriptor.column as keyof ILoan];
  
        if (
          sortDescriptor.column === "requestDate" ||
          sortDescriptor.column === "updateDate"
        ) {
          first = new Date(first as string).getTime();
          second = new Date(second as string).getTime();
        }
  
        const cmp = (first ?? 0) < (second ?? 0) ? -1 : (first ?? 0) > (second ?? 0) ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }, [sortDescriptor, filteredItems]);
  
    const pages = Math.ceil(sortedFilteredItems.length / rowsPerPage);
  
    // Apply pagination to sorted items
    const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return sortedFilteredItems.slice(start, end);
    }, [page, sortedFilteredItems]);
  
    const onSearchChange = useCallback((value?: string) => {
      if (value) {
        setFilterValue(value);
        setStatusFilter(new Set(["ALL"]));
        setPage(1);
      } else {
        setFilterValue("");
        setStatusFilter(new Set(["ALL"]));
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
  
    const handleColumnClick = (columnClicked: string) => {
      if (columnClicked === "requestDate") {
        onLoanDateOpen();
      }
    };
  
    useEffect(() => {
      const _fetch = async () => {
        setIsLoading(true);
        await fetchLoans();
        setIsLoading(false);
      };
      _fetch();
    }, [fetchLoans]);
  
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
      (loan: ILoan, columnKey: Key): ReactNode => {
        switch (columnKey) {
          case "id":
            return <p className="line-clamp-1 text-xs">#{loan.id}</p>;
          case "farmerName":
            return <p className="line-clamp-1 text-xs">{loan.farmer.name}</p>;
          // case "cropType":
          //   return <p className="line-clamp-1 text-xs">{Enums.cropTypeEnum.find(crop => crop.value === loan.cropType)?.label || '---'}</p>;
          case "amount":
            return <p className="line-clamp-1 text-xs">{loan.amount.toLocaleString('fr-FR')}</p>;
          case "requestDate":
            return (
                <p className="line-clamp-1 text-xs">
                {loan.requestDate
                  ? formatDate(new Date(loan.requestDate).toISOString())
                  : "---"}
                </p>
            );
          case "scoreRating":
            return <p className="line-clamp-1 text-xs">{loan.scoreRating}</p>;
          case "status":
            return (
              <Chip
                className="!text-[10px]"
                color={statusColorMap[loan.status]}
                size="sm"
                variant="dot"
              >
                {formatLoanStatus(loan.status)}
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
                    {(role == 'COO' && loan.status === "PENDING") ? (
                      <>
                        <DropdownItem
                          endContent={
                            <i className="fa-solid fa-chart-line text-blue-500"></i>
                            }
                            key="coo-add-evaluation"
                            onPress={() => {
                              setValue("loanId", loan.id);
                              const yearsInCooperative = new Date().getFullYear() - new Date(loan.farmer.joinedCooperativeAt).getFullYear();
                              setValue("yearsInCooperative", yearsInCooperative);
                              setValue("unpaidLoansCount", loan.farmer.ActiveLoansCount);
                              onAddEvaluationModalOpen();
                            }}
                            >
                            <span className="!font-montserrat text-xs">Évaluer</span>
                        </DropdownItem>
                      </>
                    ): null}
                    {(role =='COO' && loan.status == 'EVALUATED') ? (
                      <>
                      <DropdownItem
                        endContent={
                            <i className="fa-solid fa-pen text-blue-500"></i>
                          }
                          key="coo-edit-evaluation"
                          onPress={() => {
                            setValue("id", loan.loanEvaluation?.id);
                            setValue("loanId", loan.id);
                            setValue("yearsInCooperative", loan.loanEvaluation?.yearsInCooperative);
                            setValue("socialCapitalPayment", loan.loanEvaluation?.socialCapitalPayment);
                            setValue("unpaidLoansCount", loan.loanEvaluation?.unpaidLoansCount);
                            setValue("farmerParticipation", loan.loanEvaluation?.farmerParticipation);
                            setValue("transactionLoyalty", loan.loanEvaluation?.transactionLoyalty);
                            onAddEvaluationModalOpen();
                          }}
                          >
                          <span className="!font-montserrat text-xs">Modifier l'evaluation</span>
                      </DropdownItem>
                      <DropdownItem
                        endContent={
                          <i className="fa-solid fa-trash text-red-500"></i>
                          }
                          key="coo-cancel-evaluation"
                          onPress={() => {
                            console.log('Loan Evaluation ID-----', loan.loanEvaluation?.id);
                            handleCancelLoanEvaluation(Number(loan.loanEvaluation?.id))();
                          }}
                          >
                          <span className="!font-montserrat text-xs">Annuler l'evaluation</span>
                      </DropdownItem>
                    </>
                    ): null}
                    {role == 'COO' && loan.status === "ACCEPTED" ? (
                      <DropdownItem
                        endContent={
                          <i className="fa-solid fa-money-bill-wave text-green-500"></i>
                        }
                        key="paid"
                        onPress={handleMarkAsPaid(loan.id)}
                      >
                        <span className="!font-montserrat text-xs">
                          Marquer comme remboursé
                        </span>
                      </DropdownItem>
                    ): null}

                    {role == 'ADM' && loan.status === "PENDING" ? (
                      <>
                        <DropdownItem
                          endContent={
                            <i className="fa-solid fa-check text-green-500"></i>
                          }
                          key="accept"
                          onPress={handleConfirmLoan(loan.id)}
                        >
                          <span className="!font-montserrat text-xs">Accepter</span>
                        </DropdownItem>
                        <DropdownItem
                          endContent={
                            <i className="fa-solid fa-times text-red-500"></i>
                          }
                          key="reject"
                          onPress={handleRejectLoan(loan.id)}
                        >
                          <span className="!font-montserrat text-xs">Refuser</span>
                        </DropdownItem>
                      </>

                    ): null}
                    {role == 'ADM' && loan.status === "EVALUATED" ? (
                      <>
                        <DropdownItem
                          endContent={
                            <i className="fa-solid fa-check text-green-500"></i>
                          }
                          key="accept"
                          onPress={handleConfirmLoan(loan.id)}
                        >
                          <span className="!font-montserrat text-xs">Accepter</span>
                        </DropdownItem>
                        <DropdownItem
                          endContent={
                            <i className="fa-solid fa-times text-red-500"></i>
                          }
                          key="reject"
                          onPress={handleRejectLoan(loan.id)}
                        >
                          <span className="!font-montserrat text-xs">Refuser</span>
                        </DropdownItem>
                      </>

                    ): null}  
                    {role == 'ADM' && loan.status === "ACCEPTED" ? (
                      <DropdownItem
                        endContent={
                          <i className="fa-solid fa-money-bill-wave text-green-500"></i>
                        }
                        key="paid"
                        onPress={handleMarkAsPaid(loan.id)}
                      >
                        <span className="!font-montserrat text-xs">
                          Marquer comme remboursé
                        </span>
                      </DropdownItem>
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
  
    const topContent = useMemo(() => {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-start">
            <Input
              isClearable
              className="max-w-[350px]"
              placeholder="Search..."
              description={
                <div className="line-clamp-1"></div>
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
            <h2 className="font-bold ~text-sm/base">Avances d'intrants</h2>
            <div className="flex items-center gap-3">
              <span className="text-default-400 text-xs">
                {filteredItems.length} resultat
                {filteredItems.length > 1 && "s"}
              </span>
              <Tooltip
                content="Refresh List"
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
                  onPress={async () => {
                    setIsLoading(true);
                    await fetchLoans();
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
      filteredItems.length,
      onClear,
      statusCounts,
      handleStatusFilter,
      fetchLoans,
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
        <Table
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            emptyWrapper: "h-[493px] overflow-y-auto",
            loadingWrapper: "h-[493px] overflow-y-auto",
            tr: "cursor-pointer",
          }}
          aria-labelledby="loans-table"
          selectionMode="single"
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={(keys) => {
            if (keys === "all" || Array.from(keys).length === 0) {
              clearSelectedLoan();
            } else {
              const selectedKey = Array.from(keys)[0] as string;
              const selectedLoan = loans.find(
                (loan) => loan.id.toString() === selectedKey
              );
              if (selectedLoan) {
                setSelectedLoan(selectedLoan);
                console.log(selectedLoan);
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
                  column.uid === "requestDate" && "hover:text-zinc-400 group"
                }`}
              >
                {column.name}
  
                {column.uid === "requestDate" ? (
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
                <p>Aucune demande d'avance d'intrants</p>
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

        <Modal
          isOpen={isAddEvaluationModalOpen}
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
                Évaluer la demande d'avance d'intrants
              </motion.h1>
            </ModalHeader>
            <ModalBody>
              <form id="addEvaluationForm" onSubmit={handleSubmit(onAddEvaluation)} className="space-y-4">
                <div>
                  <Input
                    label="Nombre d'années dans la coopérative"
                    placeholder="Entrez le nombre d'années dans la coopérative"
                    type="number"
                    {...register("yearsInCooperative", { 
                      required: "Le nombre d'années dans la coopérative est requis",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Le nombre d'années doit être supérieur ou égal à 0"
                      }
                    })}
                    isInvalid={!!errors.yearsInCooperative}
                    errorMessage={errors.yearsInCooperative?.message}
                    fullWidth
                    className="w-full"
                  />
                </div>
                <div>
                  <Select
                    label="Paiement du capital social"
                    placeholder="Sélectionnez votre genre"
                    {...register("socialCapitalPayment", { required: "Paiement du capital social requis!", valueAsNumber: true })}
                    isInvalid={!!errors.socialCapitalPayment}
                    errorMessage={errors.socialCapitalPayment?.message}
                    fullWidth
                    className="w-full"
                  >
                    {Enums.socialCapitalPaymentEnum.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Input
                    label="Nombre de crédits impayés"
                    placeholder="Entrez le nombre de crédits impayés"
                    type="number"
                    {...register("unpaidLoansCount", { 
                      required: "Nombre de crédits impayés requis",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Le nombre de crédits impayés doit être supérieur ou égal à 0"
                      }
                    })}
                    isInvalid={!!errors.unpaidLoansCount}
                    errorMessage={errors.unpaidLoansCount?.message}
                    fullWidth
                    className="w-full"
                  />
                </div>
                <div>
                  <Select
                    label="Participation du producteur aux activités"
                    placeholder="Sélectionnez une option"
                    {...register("farmerParticipation", { required: "Participation du producteur requise", valueAsNumber: true })}
                    isInvalid={!!errors.farmerParticipation}
                    errorMessage={errors.farmerParticipation?.message}
                    fullWidth
                    className="w-full"
                  >
                    {Enums.farmerParticipationEnum.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Select
                    label="Fidélité dans les transactions / ventes avec la coopérative"
                    placeholder="Sélectionnez une option"
                    {...register("transactionLoyalty", { required: "Fidélité dans les transaction requise", valueAsNumber: true })}
                    isInvalid={!!errors.transactionLoyalty}
                    errorMessage={errors.transactionLoyalty?.message}
                    fullWidth
                    className="w-full"
                  >
                    {Enums.transactionLoyaltyEnum.map((option) => (
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
                form="addEvaluationForm"
                color="primary"
                size="sm"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Soumission en cours..." : "Soumettre"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default LoanList;