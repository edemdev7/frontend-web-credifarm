import { FC, useEffect, useState } from 'react';
import { IBassin, ICreateBassin, IUpdateBassin } from '../types/waterBasin';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Edit, Trash2, Plus, Search, Eye, UserPlus, UserMinus, Fish } from 'lucide-react';
import BassinDetails from './BassinDetails';
import { fetchRegions } from '../../api/regions';
import { getActiveFishFarmers } from '../../api/services/fishFarmerService';
import { IFishFarmer } from '../types/fishFarmer';

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
  { name: "Superficie (m²)", uid: "superficie", sortable: true },
  { name: "Type", uid: "type" },
  { name: "Statut", uid: "statut" },
  { name: "Région", uid: "region" },
  { name: "Pisciculteur", uid: "pisciculteur" },
  { name: "Actions", uid: "actions" },
];

interface Region {
  id: number;
  nom: string;
}

const BassinList: FC = () => {
  const { 
    bassins, 
    isLoading, 
    fetchBassins, 
    createBassin, 
    updateBassin, 
    deleteBassin,
    assignBassin,
    unassignBassin
  } = useWaterBasinStore();
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending"
  });
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBassin, setEditingBassin] = useState<IBassin | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBassinForAssign, setSelectedBassinForAssign] = useState<IBassin | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBassinForDetails, setSelectedBassinForDetails] = useState<IBassin | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [fishFarmers, setFishFarmers] = useState<IFishFarmer[]>([]);
  const [loadingFishFarmers, setLoadingFishFarmers] = useState(false);

  useEffect(() => {
    fetchBassins();
  }, [fetchBassins]);

  // Debug: Afficher les données reçues
  useEffect(() => {
    console.log('Bassins reçus:', bassins);
    console.log('Nombre de bassins:', bassins.length);
  }, [bassins]);

  // Debug: Surveiller l'état du modal
  useEffect(() => {
    console.log('État du modal isOpen:', isOpen);
  }, [isOpen]);

  // Debug: Surveiller les pisciculteurs
  useEffect(() => {
    console.log('Pisciculteurs dans le state:', fishFarmers);
    console.log('Nombre de pisciculteurs:', fishFarmers.length);
  }, [fishFarmers]);

  // Charger les régions depuis l'API
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const regionsData = await fetchRegions();
        console.log('Régions chargées:', regionsData);
        setRegions(regionsData);
      } catch (error) {
        console.error('Erreur lors du chargement des régions:', error);
      } finally {
        setLoadingRegions(false);
      }
    };

    if (isOpen) {
      loadRegions();
    }
  }, [isOpen]);

  // Charger les pisciculteurs actifs pour l'assignation
  useEffect(() => {
    const loadFishFarmers = async () => {
      setLoadingFishFarmers(true);
      try {
        const fishFarmersData = await getActiveFishFarmers();
        console.log('Pisciculteurs chargés dans le composant:', fishFarmersData);
        console.log('Nombre de pisciculteurs:', fishFarmersData.length);
        setFishFarmers(fishFarmersData);
      } catch (error) {
        console.error('Erreur lors du chargement des pisciculteurs:', error);
      } finally {
        setLoadingFishFarmers(false);
      }
    };

    if (isAssignModalOpen) {
      loadFishFarmers();
    }
  }, [isAssignModalOpen]);

  const handleAdd = () => {
    console.log('handleAdd appelé');
    setEditingBassin(null);
    onOpen();
    console.log('Modal ouvert:', isOpen);
  };

  const handleEdit = (bassin: IBassin) => {
    setEditingBassin(bassin);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bassin ?')) {
      try {
        await deleteBassin(id);
        toast.success('Bassin supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du bassin');
      }
    }
  };

  const handleAssign = (bassin: IBassin) => {
    setSelectedBassinForAssign(bassin);
    setIsAssignModalOpen(true);
  };

  const handleUnassign = async (bassin: IBassin) => {
    if (bassin.pisciculteur_assigne && confirm('Êtes-vous sûr de vouloir désassigner ce bassin ?')) {
      try {
        await unassignBassin(bassin.id, bassin.pisciculteur.id);
        toast.success('Bassin désassigné avec succès');
      } catch (error) {
        toast.error('Erreur lors de la désassignation du bassin');
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBassin) {
        const updateData: IUpdateBassin = {
          nom: values.nom,
          superficie: Number(values.superficie),
          profondeur: Number(values.profondeur),
          type: values.type,
          statut: values.statut
        };
        await updateBassin(editingBassin.id, updateData);
        toast.success('Bassin modifié avec succès');
      } else {
        const createData: ICreateBassin = {
          nom: values.nom,
          superficie: Number(values.superficie),
          profondeur: Number(values.profondeur),
          type: values.type,
          capacite_max: Number(values.capacite_max) || undefined,
          type_poisson: values.type_poisson || undefined,
          date_creation: new Date().toISOString(),
          region_id: Number(values.region_id)
        };
        await createBassin(createData);
        toast.success('Bassin ajouté avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du bassin');
    }
  };

  const handleAssignSubmit = async (values: any) => {
    if (selectedBassinForAssign) {
      try {
        await assignBassin({
          bassin_id: selectedBassinForAssign.id,
          pisciculteur_id: Number(values.pisciculteur_id)
        });
        toast.success('Bassin assigné avec succès');
        setIsAssignModalOpen(false);
        setSelectedBassinForAssign(null);
      } catch (error) {
        toast.error('Erreur lors de l\'assignation du bassin');
      }
    }
  };

  const handleViewDetails = (bassin: IBassin) => {
    setSelectedBassinForDetails(bassin);
    setIsDetailsModalOpen(true);
  };

  // Fonction pour convertir superficie en nombre pour l'affichage
  const getSuperficieNumber = (superficie: string | number): number => {
    return typeof superficie === 'string' ? parseFloat(superficie) : superficie;
  };

  const filteredItems = bassins.filter((bassin) =>
    bassin.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
    (bassin.type && bassin.type.toLowerCase().includes(filterValue.toLowerCase())) ||
    (bassin.region && bassin.region.nom.toLowerCase().includes(filterValue.toLowerCase())) ||
    (bassin.pisciculteur_assigne && `${bassin.pisciculteur_assigne.nom} ${bassin.pisciculteur_assigne.prenom}`.toLowerCase().includes(filterValue.toLowerCase()))
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortDescriptor.column) {
      let aValue: any = a[sortDescriptor.column as keyof IBassin];
      let bValue: any = b[sortDescriptor.column as keyof IBassin];
      
      // Gestion spéciale pour superficie
      if (sortDescriptor.column === 'superficie') {
        aValue = getSuperficieNumber(aValue);
        bValue = getSuperficieNumber(bValue);
      }
      
      // Gestion des valeurs undefined
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    }
    return 0;
  });

  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const items = sortedItems.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const renderCell = (bassin: IBassin, columnKey: string) => {
    switch (columnKey) {
      case "nom":
        return <div className="font-medium">{bassin.nom}</div>;
      case "superficie":
        return <div>{getSuperficieNumber(bassin.superficie)} m²</div>;
      case "type":
        return <div>{bassin.type || 'Non spécifié'}</div>;
      case "statut":
        console.log('Rendu statut pour bassin:', bassin.id, 'statut:', bassin.statut);
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[bassin.statut]}
            size="sm"
            variant="flat"
          >
            {bassin.statut}
          </Chip>
        );
      case "region":
        return <div>{bassin.region?.nom || 'Non assigné'}</div>;
      case "pisciculteur":
        return (
          <div>
            {bassin.pisciculteur_assigne 
              ? `${bassin.pisciculteur_assigne.nom} ${bassin.pisciculteur_assigne.prenom}`
              : 'Non assigné'
            }
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Voir les détails">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleViewDetails(bassin)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Modifier">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleEdit(bassin)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            {bassin.pisciculteur ? (
              <Tooltip content="Désassigner">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="warning"
                  onPress={() => handleUnassign(bassin)}
                >
                  <UserMinus className="w-4 h-4" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Assigner">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="primary"
                  onPress={() => handleAssign(bassin)}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Supprimer">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(bassin.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = bassin[columnKey as keyof IBassin];
        return <div>{typeof value === 'string' || typeof value === 'number' ? value : '-'}</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Afficher un message si aucun bassin n'est trouvé
  if (bassins.length === 0) {
    console.log('Affichage de l\'état vide - bassins.length:', bassins.length);
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
            onPress={() => {
              console.log('Bouton Ajouter cliqué');
              handleAdd();
            }}
          >
            Ajouter un bassin
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-500 mb-4">
            <Fish className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun bassin trouvé</h3>
            <p className="text-sm">Commencez par ajouter votre premier bassin</p>
          </div>
          <Button
            color="primary"
            endContent={<Plus className="w-4 h-4" />}
            onPress={() => {
              console.log('Bouton Ajouter cliqué');
              handleAdd();
            }}
          >
            Ajouter un bassin
          </Button>
        </div>
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
          onPress={() => {
            console.log('Bouton Ajouter cliqué');
            handleAdd();
          }}
        >
          Ajouter un bassin
        </Button>
      </div>

      <Table
        aria-label="Liste des bassins"
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
                <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal pour créer/modifier un bassin */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const values = {
              nom: formData.get('nom'),
              superficie: formData.get('superficie'),
              profondeur: formData.get('profondeur'),
              type: formData.get('type'),
              capacite_max: formData.get('capacite_max'),
              type_poisson: formData.get('type_poisson'),
              region_id: formData.get('region_id'),
              statut: formData.get('statut'),
            };
            handleSubmit(values);
          }}>
            <ModalHeader>
              {editingBassin ? 'Modifier le bassin' : 'Ajouter un bassin'}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nom"
                  name="nom"
                  defaultValue={editingBassin?.nom}
                  required
                />
                <Input
                  type="number"
                  label="Superficie (m²)"
                  name="superficie"
                  defaultValue={editingBassin?.superficie?.toString()}
                  required
                />
                <Input
                  type="number"
                  label="Profondeur (m)"
                  name="profondeur"
                  min="0"
                  step="0.1"
                  defaultValue={editingBassin?.profondeur?.toString()}
                  required
                />
                <Input
                  label="Type"
                  name="type"
                  placeholder="Ex: Bassin d'irrigation, Bassin de pêche..."
                  defaultValue={editingBassin?.type}
                  required
                />
                <Input
                  type="number"
                  label="Capacité maximale"
                  name="capacite_max"
                  placeholder="Optionnel"
                />
                <Input
                  label="Type de poisson"
                  name="type_poisson"
                  placeholder="Optionnel"
                />
                <Select
                  label="Région"
                  name="region_id"
                  defaultSelectedKeys={editingBassin?.region ? [editingBassin.region.id.toString()] : []}
                  required
                  isLoading={loadingRegions}
                  startContent={loadingRegions ? <Spinner size="sm" /> : undefined}
                >
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </Select>
                {editingBassin && (
                  <Select
                    label="Statut"
                    name="statut"
                    defaultSelectedKeys={[editingBassin.statut]}
                    required
                  >
                    <SelectItem key="ACTIF" value="ACTIF">Actif</SelectItem>
                    <SelectItem key="EN_MAINTENANCE" value="EN_MAINTENANCE">En maintenance</SelectItem>
                    <SelectItem key="INACTIF" value="INACTIF">Inactif</SelectItem>
                  </Select>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                {editingBassin ? 'Modifier' : 'Ajouter'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal pour assigner un bassin */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)}>
        <ModalContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const values = {
              pisciculteur_id: formData.get('pisciculteur_id'),
            };
            handleAssignSubmit(values);
          }}>
            <ModalHeader>
              Assigner le bassin "{selectedBassinForAssign?.nom}"
            </ModalHeader>
            <ModalBody>
              <Select
                label="Pisciculteur"
                name="pisciculteur_id"
                required
                isLoading={loadingFishFarmers}
                startContent={loadingFishFarmers ? <Spinner size="sm" /> : undefined}
              >
                {fishFarmers.length === 0 ? (
                  <SelectItem key="no-data" value="">
                    Aucun pisciculteur éligible trouvé
                  </SelectItem>
                ) : (
                  fishFarmers.map(fishFarmer => (
                    <SelectItem key={fishFarmer.id} value={fishFarmer.id}>
                      {fishFarmer.nom} {fishFarmer.prenom}
                    </SelectItem>
                  ))
                )}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsAssignModalOpen(false)}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Assigner
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal pour les détails du bassin */}
      <BassinDetails
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBassinForDetails(null);
        }}
        bassin={selectedBassinForDetails}
      />
    </div>
  );
};

export default BassinList; 