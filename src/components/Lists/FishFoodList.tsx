import { FC, useEffect, useState } from 'react';
import { IFishFood, ICreateFishFood, IUpdateFishFood } from '../types/fish';
import { useFishFoodStore } from '../../store/fishStore';
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
  Select,
  SelectItem,
  Progress,
} from "@heroui/react";
import { Edit, Trash2, Plus, Search, Eye, Fish, Camera, Package, DollarSign, Scale } from 'lucide-react';

// Constants
const ROWS_PER_PAGE = 8;

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  INACTIF: "danger",
  RUPTURE: "warning",
};

const typeColorMap: Record<string, ChipProps["color"]> = {
  GRANULES: "primary",
  FLOCONS: "secondary",
  PAILLETTES: "success",
  PATE: "warning",
  VIANDE: "danger",
};

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Image", uid: "image" },
  { name: "Nom", uid: "nom", sortable: true },
  { name: "Marque", uid: "marque", sortable: true },
  { name: "Type", uid: "type" },
  { name: "Stade de vie", uid: "stade_vie" },
  { name: "Protéines (%)", uid: "proteines", sortable: true },
  { name: "Prix (FCFA/kg)", uid: "prix_unitaire", sortable: true },
  { name: "Stock (kg)", uid: "stock_disponible", sortable: true },
  { name: "Statut", uid: "statut" },
  { name: "Actions", uid: "actions" },
];

const FishFoodList: FC = () => {
  const { 
    foods, 
    isLoading, 
    fetchFoods, 
    createFood, 
    updateFood, 
    deleteFood,
    updateFoodStatus,
    updateFoodStock
  } = useFishFoodStore();
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending"
  });
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingFood, setEditingFood] = useState<IFishFood | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<IFishFood | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedFoodForStock, setSelectedFoodForStock] = useState<IFishFood | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleAdd = () => {
    setEditingFood(null);
    setSelectedImage(null);
    setImagePreview("");
    onOpen();
  };

  const handleEdit = (food: IFishFood) => {
    setEditingFood(food);
    setSelectedImage(null);
    setImagePreview(food.image_url || "");
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet aliment ?')) {
      try {
        await deleteFood(id);
        toast.success('Aliment supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'aliment');
      }
    }
  };

  const handleStatusChange = async (food: IFishFood, newStatus: 'ACTIF' | 'INACTIF' | 'RUPTURE') => {
    try {
      await updateFoodStatus(food.id, newStatus);
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleStockUpdate = async () => {
    if (selectedFoodForStock) {
      try {
        await updateFoodStock(selectedFoodForStock.id, newStockValue);
        setIsStockModalOpen(false);
        setSelectedFoodForStock(null);
        setNewStockValue(0);
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du stock');
      }
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
      if (editingFood) {
        const updateData: IUpdateFishFood = {
          nom: values.nom,
          marque: values.marque,
          type: values.type,
          taille_granule: values.taille_granule,
          composition: values.composition,
          proteines: Number(values.proteines),
          lipides: Number(values.lipides),
          glucides: Number(values.glucides),
          fibres: Number(values.fibres),
          cendres: Number(values.cendres),
          humidite: Number(values.humidite),
          energie: Number(values.energie),
          especes_compatibles: [1, 2, 3], // Mock pour l'exemple
          stade_vie: values.stade_vie,
          frequence_alimentation: values.frequence_alimentation,
          quantite_recommandee: values.quantite_recommandee,
          prix_unitaire: Number(values.prix_unitaire),
          stock_disponible: Number(values.stock_disponible),
          description: values.description,
          image: selectedImage || undefined
        };
        await updateFood(editingFood.id, updateData);
        toast.success('Aliment modifié avec succès');
      } else {
        const createData: ICreateFishFood = {
          nom: values.nom,
          marque: values.marque,
          type: values.type,
          taille_granule: values.taille_granule,
          composition: values.composition,
          proteines: Number(values.proteines),
          lipides: Number(values.lipides),
          glucides: Number(values.glucides),
          fibres: Number(values.fibres),
          cendres: Number(values.cendres),
          humidite: Number(values.humidite),
          energie: Number(values.energie),
          especes_compatibles: [1, 2, 3], // Mock pour l'exemple
          stade_vie: values.stade_vie,
          frequence_alimentation: values.frequence_alimentation,
          quantite_recommandee: values.quantite_recommandee,
          prix_unitaire: Number(values.prix_unitaire),
          stock_disponible: Number(values.stock_disponible),
          description: values.description,
          image: selectedImage || undefined
        };
        await createFood(createData);
        toast.success('Aliment ajouté avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de l\'aliment');
    }
  };

  const handleViewDetails = (food: IFishFood) => {
    setSelectedFoodForDetails(food);
    setIsDetailsModalOpen(true);
  };

  const handleManageStock = (food: IFishFood) => {
    setSelectedFoodForStock(food);
    setNewStockValue(food.stock_disponible);
    setIsStockModalOpen(true);
  };

  const filteredItems = foods.filter((food) =>
    food.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
    food.marque.toLowerCase().includes(filterValue.toLowerCase()) ||
    food.type.toLowerCase().includes(filterValue.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortDescriptor.column) {
      let aValue: any = a[sortDescriptor.column as keyof IFishFood];
      let bValue: any = b[sortDescriptor.column as keyof IFishFood];
      
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

  const renderCell = (food: IFishFood, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <Image
            src={food.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop"}
            alt={food.nom}
            className="w-12 h-12 object-cover rounded-lg"
            fallbackSrc="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop"
          />
        );
      case "nom":
        return <div className="font-medium">{food.nom}</div>;
      case "marque":
        return <div>{food.marque}</div>;
      case "type":
        return (
          <Chip
            className="capitalize"
            color={typeColorMap[food.type]}
            size="sm"
            variant="flat"
          >
            {food.type}
          </Chip>
        );
      case "stade_vie":
        return <div className="text-sm">{food.stade_vie}</div>;
      case "proteines":
        return (
          <div className="flex items-center gap-2">
            <Progress 
              value={food.proteines} 
              className="w-16" 
              color={food.proteines > 35 ? "success" : food.proteines > 25 ? "warning" : "danger"}
            />
            <span className="text-sm">{food.proteines}%</span>
          </div>
        );
      case "prix_unitaire":
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{food.prix_unitaire.toLocaleString()}</span>
          </div>
        );
      case "stock_disponible":
        return (
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            <span>{food.stock_disponible} kg</span>
          </div>
        );
      case "statut":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[food.statut]}
            size="sm"
            variant="flat"
          >
            {food.statut}
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
                onPress={() => handleViewDetails(food)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Modifier">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleEdit(food)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Gérer le stock">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="warning"
                onPress={() => handleManageStock(food)}
              >
                <Package className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Supprimer">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(food.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = food[columnKey as keyof IFishFood];
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
          placeholder="Rechercher un aliment..."
          startContent={<Search className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Ajouter un aliment
        </Button>
      </div>

      <Table
        aria-label="Liste des aliments pour poissons"
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

      {/* Modal pour créer/modifier un aliment */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const values = {
              nom: formData.get('nom'),
              marque: formData.get('marque'),
              type: formData.get('type'),
              taille_granule: formData.get('taille_granule'),
              composition: formData.get('composition'),
              proteines: formData.get('proteines'),
              lipides: formData.get('lipides'),
              glucides: formData.get('glucides'),
              fibres: formData.get('fibres'),
              cendres: formData.get('cendres'),
              humidite: formData.get('humidite'),
              energie: formData.get('energie'),
              stade_vie: formData.get('stade_vie'),
              frequence_alimentation: formData.get('frequence_alimentation'),
              quantite_recommandee: formData.get('quantite_recommandee'),
              prix_unitaire: formData.get('prix_unitaire'),
              stock_disponible: formData.get('stock_disponible'),
              description: formData.get('description'),
            };
            handleSubmit(values);
          }}>
            <ModalHeader>
              {editingFood ? 'Modifier l\'aliment' : 'Ajouter un aliment'}
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
                  label="Nom de l'aliment"
                  name="nom"
                  defaultValue={editingFood?.nom}
                  required
                />
                <Input
                  label="Marque"
                  name="marque"
                  defaultValue={editingFood?.marque}
                  required
                />
                <Select
                  label="Type d'aliment"
                  name="type"
                  defaultSelectedKeys={editingFood?.type ? [editingFood.type] : []}
                  required
                >
                  <SelectItem key="GRANULES" value="GRANULES">Granulés</SelectItem>
                  <SelectItem key="FLOCONS" value="FLOCONS">Flocons</SelectItem>
                  <SelectItem key="PAILLETTES" value="PAILLETTES">Paillettes</SelectItem>
                  <SelectItem key="PATE" value="PATE">Pâte</SelectItem>
                  <SelectItem key="VIANDE" value="VIANDE">Viande</SelectItem>
                </Select>
                <Input
                  label="Taille des granulés (optionnel)"
                  name="taille_granule"
                  defaultValue={editingFood?.taille_granule}
                  placeholder="Ex: 2-4mm"
                />

                {/* Composition nutritionnelle */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-2">Composition nutritionnelle (%)</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      label="Protéines"
                      name="proteines"
                      defaultValue={editingFood?.proteines?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Lipides"
                      name="lipides"
                      defaultValue={editingFood?.lipides?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Glucides"
                      name="glucides"
                      defaultValue={editingFood?.glucides?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Fibres"
                      name="fibres"
                      defaultValue={editingFood?.fibres?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Cendres"
                      name="cendres"
                      defaultValue={editingFood?.cendres?.toString()}
                      required
                    />
                    <Input
                      type="number"
                      label="Humidité"
                      name="humidite"
                      defaultValue={editingFood?.humidite?.toString()}
                      required
                    />
                  </div>
                </div>

                <Input
                  type="number"
                  label="Énergie (kcal/100g)"
                  name="energie"
                  defaultValue={editingFood?.energie?.toString()}
                  required
                />
                <Select
                  label="Stade de vie"
                  name="stade_vie"
                  defaultSelectedKeys={editingFood?.stade_vie ? [editingFood.stade_vie] : []}
                  required
                >
                  <SelectItem key="ALEVINS" value="ALEVINS">Alevins</SelectItem>
                  <SelectItem key="JUVENILES" value="JUVENILES">Juvéniles</SelectItem>
                  <SelectItem key="ADULTES" value="ADULTES">Adultes</SelectItem>
                  <SelectItem key="REPRODUCTEURS" value="REPRODUCTEURS">Reproducteurs</SelectItem>
                  <SelectItem key="TOUS" value="TOUS">Tous</SelectItem>
                </Select>

                <Input
                  label="Fréquence d'alimentation"
                  name="frequence_alimentation"
                  defaultValue={editingFood?.frequence_alimentation}
                  placeholder="Ex: 2-3 fois par jour"
                  required
                />
                <Input
                  label="Quantité recommandée"
                  name="quantite_recommandee"
                  defaultValue={editingFood?.quantite_recommandee}
                  placeholder="Ex: 3-5% du poids corporel"
                  required
                />

                <Input
                  type="number"
                  label="Prix unitaire (FCFA/kg)"
                  name="prix_unitaire"
                  defaultValue={editingFood?.prix_unitaire?.toString()}
                  required
                />
                <Input
                  type="number"
                  label="Stock disponible (kg)"
                  name="stock_disponible"
                  defaultValue={editingFood?.stock_disponible?.toString()}
                  required
                />

                {/* Composition et description */}
                <div className="md:col-span-2">
                  <Textarea
                    label="Composition"
                    name="composition"
                    defaultValue={editingFood?.composition}
                    placeholder="Liste des ingrédients..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    name="description"
                    defaultValue={editingFood?.description}
                    placeholder="Description détaillée de l'aliment..."
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
                {editingFood ? 'Modifier' : 'Ajouter'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal pour les détails */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} size="3xl">
        <ModalContent>
          <ModalHeader>Détails de l'aliment</ModalHeader>
          <ModalBody>
            {selectedFoodForDetails && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedFoodForDetails.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"}
                    alt={selectedFoodForDetails.nom}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedFoodForDetails.nom}</h3>
                    <p className="text-gray-600">{selectedFoodForDetails.marque}</p>
                    <div className="flex gap-2 mt-2">
                      <Chip color={typeColorMap[selectedFoodForDetails.type]} size="sm">
                        {selectedFoodForDetails.type}
                      </Chip>
                      <Chip color={statusColorMap[selectedFoodForDetails.statut]} size="sm">
                        {selectedFoodForDetails.statut}
                      </Chip>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Informations nutritionnelles</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Protéines:</span>
                        <span className="font-medium">{selectedFoodForDetails.proteines}%</span>
                      </div>
                      <Progress value={selectedFoodForDetails.proteines} className="w-full" />
                      
                      <div className="flex justify-between">
                        <span>Lipides:</span>
                        <span className="font-medium">{selectedFoodForDetails.lipides}%</span>
                      </div>
                      <Progress value={selectedFoodForDetails.lipides} className="w-full" />
                      
                      <div className="flex justify-between">
                        <span>Glucides:</span>
                        <span className="font-medium">{selectedFoodForDetails.glucides}%</span>
                      </div>
                      <Progress value={selectedFoodForDetails.glucides} className="w-full" />
                      
                      <div className="flex justify-between">
                        <span>Fibres:</span>
                        <span className="font-medium">{selectedFoodForDetails.fibres}%</span>
                      </div>
                      <Progress value={selectedFoodForDetails.fibres} className="w-full" />
                      
                      <div className="flex justify-between">
                        <span>Énergie:</span>
                        <span className="font-medium">{selectedFoodForDetails.energie} kcal/100g</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Informations commerciales</h4>
                    <div className="space-y-2">
                      <p><strong>Prix:</strong> {selectedFoodForDetails.prix_unitaire.toLocaleString()} FCFA/kg</p>
                      <p><strong>Stock:</strong> {selectedFoodForDetails.stock_disponible} kg</p>
                      <p><strong>Stade de vie:</strong> {selectedFoodForDetails.stade_vie}</p>
                      <p><strong>Fréquence:</strong> {selectedFoodForDetails.frequence_alimentation}</p>
                      <p><strong>Quantité:</strong> {selectedFoodForDetails.quantite_recommandee}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Composition</h4>
                  <p className="text-gray-700">{selectedFoodForDetails.composition}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{selectedFoodForDetails.description}</p>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal pour gérer le stock */}
      <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Gérer le stock</ModalHeader>
          <ModalBody>
            {selectedFoodForStock && (
              <div className="space-y-4">
                <p><strong>Aliment:</strong> {selectedFoodForStock.nom}</p>
                <p><strong>Stock actuel:</strong> {selectedFoodForStock.stock_disponible} kg</p>
                <Input
                  type="number"
                  label="Nouveau stock (kg)"
                  value={newStockValue}
                  onValueChange={(value) => setNewStockValue(Number(value))}
                  min={0}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsStockModalOpen(false)}>
              Annuler
            </Button>
            <Button color="primary" onPress={handleStockUpdate}>
              Mettre à jour
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FishFoodList; 