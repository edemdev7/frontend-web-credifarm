import { FC, useEffect, useState } from 'react';
import { IFishSpecies, ICreateFishSpecies, IUpdateFishSpecies } from '../types/fish';
import { useFishSpeciesStore } from '../../store/fishStore';
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
  Image,
  Switch,
} from "@heroui/react";
import { Edit, Trash2, Plus, Search, Eye, Fish, Camera, Thermometer, Droplets } from 'lucide-react';

// Constants
const ROWS_PER_PAGE = 8;

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  INACTIF: "danger",
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Image", uid: "image" },
  { name: "Nom", uid: "nom", sortable: true },
  { name: "Nom scientifique", uid: "nom_scientifique", sortable: true },
  { name: "Famille", uid: "famille" },
  { name: "Taille (cm)", uid: "taille_moyenne", sortable: true },
  { name: "Poids (g)", uid: "poids_moyen", sortable: true },
  { name: "Température (°C)", uid: "temperature" },
  { name: "pH", uid: "ph" },
  { name: "Statut", uid: "statut" },
  { name: "Actions", uid: "actions" },
];

const FishSpeciesList: FC = () => {
  const { 
    species, 
    isLoading, 
    fetchSpecies, 
    createSpecies, 
    updateSpecies, 
    deleteSpecies,
    toggleSpeciesStatus
  } = useFishSpeciesStore();
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending"
  });
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingSpecies, setEditingSpecies] = useState<IFishSpecies | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSpeciesForDetails, setSelectedSpeciesForDetails] = useState<IFishSpecies | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  const handleAdd = () => {
    setEditingSpecies(null);
    setSelectedImage(null);
    setImagePreview("");
    onOpen();
  };

  const handleEdit = (species: IFishSpecies) => {
    setEditingSpecies(species);
    setSelectedImage(null);
    setImagePreview(species.image_url || "");
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette espèce de poisson ?')) {
      try {
        await deleteSpecies(id);
        toast.success('Espèce supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'espèce');
      }
    }
  };

  const handleToggleStatus = async (species: IFishSpecies) => {
    try {
      await toggleSpeciesStatus(species.id);
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingSpecies) {
        const updateData: IUpdateFishSpecies = {
          nom: values.nom,
          nom_scientifique: values.nom_scientifique,
          famille: values.famille,
          taille_moyenne: Number(values.taille_moyenne),
          poids_moyen: Number(values.poids_moyen),
          duree_vie: Number(values.duree_vie),
          temperature_optimale: {
            min: Number(values.temp_min),
            max: Number(values.temp_max)
          },
          ph_optimal: {
            min: Number(values.ph_min),
            max: Number(values.ph_max)
          },
          description: values.description,
          image: selectedImage || undefined
        };
        await updateSpecies(editingSpecies.id, updateData);
        toast.success('Espèce modifiée avec succès');
      } else {
        const createData: ICreateFishSpecies = {
          nom: values.nom,
          nom_scientifique: values.nom_scientifique,
          famille: values.famille,
          taille_moyenne: Number(values.taille_moyenne),
          poids_moyen: Number(values.poids_moyen),
          duree_vie: Number(values.duree_vie),
          temperature_optimale: {
            min: Number(values.temp_min),
            max: Number(values.temp_max)
          },
          ph_optimal: {
            min: Number(values.ph_min),
            max: Number(values.ph_max)
          },
          description: values.description,
          image: selectedImage || undefined
        };
        await createSpecies(createData);
        toast.success('Espèce ajoutée avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de l\'espèce');
    }
  };

  const handleViewDetails = (species: IFishSpecies) => {
    setSelectedSpeciesForDetails(species);
    setIsDetailsModalOpen(true);
  };

  const filteredItems = species.filter((species) =>
    species.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
    species.nom_scientifique.toLowerCase().includes(filterValue.toLowerCase()) ||
    species.famille.toLowerCase().includes(filterValue.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortDescriptor.column) {
      let aValue: any = a[sortDescriptor.column as keyof IFishSpecies];
      let bValue: any = b[sortDescriptor.column as keyof IFishSpecies];
      
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

  const renderCell = (species: IFishSpecies, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <Image
            src={species.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop"}
            alt={species.nom}
            className="w-12 h-12 object-cover rounded-lg"
            fallbackSrc="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop"
          />
        );
      case "nom":
        return <div className="font-medium">{species.nom}</div>;
      case "nom_scientifique":
        return <div className="italic text-sm">{species.nom_scientifique}</div>;
      case "famille":
        return <div>{species.famille}</div>;
      case "taille_moyenne":
        return <div>{species.taille_moyenne} cm</div>;
      case "poids_moyen":
        return <div>{species.poids_moyen} g</div>;
      case "temperature":
        return (
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span>{species.temperature_optimale.min}-{species.temperature_optimale.max}°C</span>
          </div>
        );
      case "ph":
        return (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{species.ph_optimal.min}-{species.ph_optimal.max}</span>
          </div>
        );
      case "statut":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[species.statut]}
            size="sm"
            variant="flat"
          >
            {species.statut}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Voir les détails">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleViewDetails(species)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Modifier">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleEdit(species)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Changer le statut">
              <Switch
                size="sm"
                isSelected={species.statut === 'ACTIF'}
                onValueChange={() => handleToggleStatus(species)}
              />
            </Tooltip>
            <Tooltip content="Supprimer">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(species.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = species[columnKey as keyof IFishSpecies];
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Rechercher une espèce..."
          startContent={<Search className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Ajouter une espèce
        </Button>
      </div>

      <Table
        aria-label="Liste des espèces de poissons"
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

      {/* Modal pour créer/modifier une espèce */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const values = {
              nom: formData.get('nom'),
              nom_scientifique: formData.get('nom_scientifique'),
              famille: formData.get('famille'),
              taille_moyenne: formData.get('taille_moyenne'),
              poids_moyen: formData.get('poids_moyen'),
              duree_vie: formData.get('duree_vie'),
              temp_min: formData.get('temp_min'),
              temp_max: formData.get('temp_max'),
              ph_min: formData.get('ph_min'),
              ph_max: formData.get('ph_max'),
              description: formData.get('description'),
            };
            handleSubmit(values);
          }}>
            <ModalHeader>
              {editingSpecies ? 'Modifier l\'espèce' : 'Ajouter une espèce'}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image upload */}
                <div className="md:col-span-2">
                  <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="text-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          variant="bordered"
                          startContent={<Camera className="w-4 h-4" />}
                        >
                          {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Informations de base */}
                <Input
                  label="Nom commun"
                  name="nom"
                  defaultValue={editingSpecies?.nom}
                  required
                />
                <Input
                  label="Nom scientifique"
                  name="nom_scientifique"
                  defaultValue={editingSpecies?.nom_scientifique}
                  required
                />
                <Input
                  label="Famille"
                  name="famille"
                  defaultValue={editingSpecies?.famille}
                  required
                />
                <Input
                  type="number"
                  label="Taille moyenne (cm)"
                  name="taille_moyenne"
                  defaultValue={editingSpecies?.taille_moyenne?.toString()}
                  required
                />
                <Input
                  type="number"
                  label="Poids moyen (g)"
                  name="poids_moyen"
                  defaultValue={editingSpecies?.poids_moyen?.toString()}
                  required
                />
                <Input
                  type="number"
                  label="Durée de vie (années)"
                  name="duree_vie"
                  defaultValue={editingSpecies?.duree_vie?.toString()}
                  required
                />

                {/* Température optimale */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-2">Température optimale (°C)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      label="Min"
                      name="temp_min"
                      defaultValue={editingSpecies?.temperature_optimale.min?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Max"
                      name="temp_max"
                      defaultValue={editingSpecies?.temperature_optimale.max?.toString()}
                      required
                    />
                  </div>
                </div>

                {/* pH optimal */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-2">pH optimal</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      label="Min"
                      name="ph_min"
                      step="0.1"
                      defaultValue={editingSpecies?.ph_optimal.min?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Max"
                      name="ph_max"
                      step="0.1"
                      defaultValue={editingSpecies?.ph_optimal.max?.toString()}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    name="description"
                    defaultValue={editingSpecies?.description}
                    placeholder="Description détaillée de l'espèce..."
                    required
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                {editingSpecies ? 'Modifier' : 'Ajouter'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal pour les détails */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>Détails de l'espèce</ModalHeader>
          <ModalBody>
            {selectedSpeciesForDetails && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedSpeciesForDetails.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"}
                    alt={selectedSpeciesForDetails.nom}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedSpeciesForDetails.nom}</h3>
                    <p className="text-gray-600 italic">{selectedSpeciesForDetails.nom_scientifique}</p>
                    <p className="text-sm text-gray-500">Famille: {selectedSpeciesForDetails.famille}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Caractéristiques physiques</h4>
                    <p>Taille moyenne: {selectedSpeciesForDetails.taille_moyenne} cm</p>
                    <p>Poids moyen: {selectedSpeciesForDetails.poids_moyen} g</p>
                    <p>Durée de vie: {selectedSpeciesForDetails.duree_vie} années</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Conditions optimales</h4>
                    <p>Température: {selectedSpeciesForDetails.temperature_optimale.min}-{selectedSpeciesForDetails.temperature_optimale.max}°C</p>
                    <p>pH: {selectedSpeciesForDetails.ph_optimal.min}-{selectedSpeciesForDetails.ph_optimal.max}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{selectedSpeciesForDetails.description}</p>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FishSpeciesList; 