import { FC, useEffect, useState } from 'react';
import { IBassin } from '../types/waterBasin';
import { useWaterBasinStore } from '../../store/waterBasinStore';
import { toast } from 'react-hot-toast';
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
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import WaterBasinForm from './WaterBasinForm';

// Constants
const ROWS_PER_PAGE = 8;

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  EN_MAINTENANCE: "warning",
  INACTIF: "danger",
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Nom", uid: "nom", sortable: true },
  { name: "Description", uid: "description" },
  { name: "Superficie (m²)", uid: "superficie", sortable: true },
  { name: "Profondeur (m)", uid: "profondeur", sortable: true },
  { name: "Région", uid: "region" },
  { name: "Statut", uid: "statut" },
  { name: "Actions", uid: "actions" },
];

const WaterBasinList: FC = () => {
  const { bassins, isLoading, fetchBassins, createBassin, updateBassin, deleteBassin } = useWaterBasinStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBasin, setEditingBasin] = useState<IBassin | null>(null);

  useEffect(() => {
    fetchBassins();
  }, [fetchBassins]);

  const handleAdd = () => {
    setEditingBasin(null);
    onOpen();
  };

  const handleEdit = (basin: IBassin) => {
    setEditingBasin(basin);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBassin(id);
      toast.success('Bassin d\'eau supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du bassin d\'eau');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBasin) {
        await updateBassin(editingBasin.id, values);
        toast.success('Bassin d\'eau modifié avec succès');
      } else {
        await createBassin(values);
        toast.success('Bassin d\'eau ajouté avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du bassin d\'eau');
    }
  };

  const filteredItems = bassins.filter((basin) =>
    basin.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
    (basin.description && basin.description.toLowerCase().includes(filterValue.toLowerCase())) ||
    (basin.region && basin.region.nom.toLowerCase().includes(filterValue.toLowerCase()))
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortDescriptor.column) {
      const aValue = a[sortDescriptor.column as keyof IBassin];
      const bValue = b[sortDescriptor.column as keyof IBassin];
      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    }
    return 0;
  });

  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const items = sortedItems.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const renderCell = (basin: IBassin, columnKey: string) => {
    switch (columnKey) {
      case "nom":
        return <div className="font-medium">{basin.nom}</div>;
      case "description":
        return <div className="max-w-xs truncate">{basin.description || '-'}</div>;
      case "superficie":
        return <div>{basin.superficie} m²</div>;
      case "profondeur":
        return <div>{basin.profondeur || '-'} m</div>;
      case "region":
        return <div>{basin.region?.nom || '-'}</div>;
      case "statut":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[basin.statut]}
            size="sm"
            variant="flat"
          >
            {basin.statut}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Modifier">
              <Button
                isIconOnly
                variant="light"
                onPress={() => handleEdit(basin)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Supprimer">
              <Button
                isIconOnly
                color="danger"
                variant="light"
                onPress={() => handleDelete(basin.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Rechercher..."
          startContent={<Search className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Ajouter un bassin
        </Button>
      </div>

      <Table
        aria-label="Liste des bassins d'eau"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        }
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <WaterBasinForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        editingBasin={editingBasin}
      />
    </div>
  );
};

export default WaterBasinList; 