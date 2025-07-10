import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IFishFarmer, IUpdateFishFarmerStatus } from '../types/fishFarmer';
import { useFishFarmerStore } from '../../store/fishFarmerStore';
import { toast } from 'react-hot-toast';
import {
  Button,
  Chip,
  ChipProps,
  Input,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
  Switch,
  Textarea,
} from "@heroui/react";
import { Edit, Trash2, ArrowLeft, Save, X, UserMinus, Activity, Fish } from 'lucide-react';
import { fetchRegions } from '../../api/regions';
import { fetchDepartments } from '../../api/department';
import ActivityModal from '../Activity/ActivityModal';

const statusColorMap: Record<string, ChipProps["color"]> = {
  actif: "success",
  inactif: "danger",
};

interface Region {
  id: number;
  nom: string;
  departement?: {
    id: number;
    nom: string;
  };
}

interface Department {
  id: number;
  nom: string;
  regions: Region[];
}

const FishFarmerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    fishFarmers, 
    fishFarmerBasins,
    fetchAllFishFarmers, 
    deleteFishFarmerData,
    updateStatus,
    unassignBasin,
    fetchFishFarmerBasins
  } = useFishFarmerStore();
  
  const [fishFarmer, setFishFarmer] = useState<IFishFarmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    region_id: '',
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  
  // États pour les modals
  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();
  const { isOpen: isActivityModalOpen, onOpen: onActivityModalOpen, onClose: onActivityModalClose } = useDisclosure();
  const { isOpen: isBasinsModalOpen, onOpen: onBasinsModalOpen, onClose: onBasinsModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllFishFarmers();
      setIsLoading(false);
    };
    loadData();
  }, [fetchAllFishFarmers]);

  useEffect(() => {
    if (fishFarmers.length > 0 && id) {
      const foundFishFarmer = fishFarmers.find(f => f.id === parseInt(id));
      if (foundFishFarmer) {
        setFishFarmer(foundFishFarmer);
        setEditForm({
          nom: foundFishFarmer.nom || '',
          prenom: foundFishFarmer.prenom || '',
          telephone: foundFishFarmer.telephone || '',
          email: foundFishFarmer.email || '',
          region_id: foundFishFarmer.region?.id?.toString() || '',
        });
      }
    }
  }, [fishFarmers, id]);

  useEffect(() => {
    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const regionsData = await fetchRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error('Erreur lors du chargement des régions:', error);
      } finally {
        setLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  const handleDelete = async () => {
    if (!fishFarmer || !confirm('Êtes-vous sûr de vouloir supprimer ce pisciculteur ?')) return;
    
    try {
      await deleteFishFarmerData(fishFarmer.id);
      toast.success('Pisciculteur supprimé avec succès');
      navigate('/admin/pisciculteurs');
    } catch (error) {
      toast.error('Erreur lors de la suppression du pisciculteur');
    }
  };

  const handleStatusUpdate = () => {
    onStatusModalOpen();
  };

  const handleViewActivities = () => {
    onActivityModalOpen();
  };

  const handleViewBasins = async () => {
    if (!fishFarmer) return;
    await fetchFishFarmerBasins(fishFarmer.id);
    onBasinsModalOpen();
  };

  const handleUnassignBasin = async (basinId: number, fishFarmerId: number) => {
    if (!confirm("Désassigner ce bassin du pisciculteur ?")) return;
    try {
      await unassignBasin(basinId, fishFarmerId);
      toast.success("Bassin désassigné avec succès");
      await fetchFishFarmerBasins(fishFarmerId);
    } catch {
      toast.error("Erreur lors de la désassignation");
    }
  };

  const handleEdit = () => {
    onEditModalOpen();
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishFarmer) return;

    try {
      // Ici vous ajouteriez l'appel API pour mettre à jour le pisciculteur
      console.log('Données à mettre à jour:', editForm);
      toast.success('Pisciculteur modifié avec succès');
      onEditModalClose();
      await fetchAllFishFarmers();
    } catch (error) {
      toast.error('Erreur lors de la modification du pisciculteur');
    }
  };

  // Calculer le score d'éligibilité
  const calculateEligibilityScore = (fishFarmer: IFishFarmer) => {
    let score = 0;
    if (fishFarmer.compte_actif) score += 30;
    if (fishFarmer.eligible_soa) score += 25;
    if (fishFarmer.status === 'actif') score += 20;
    if (fishFarmer.derniereConnexion) score += 15;
    if (fishFarmer.region) score += 10;
    return Math.min(score, 100);
  };

  // Fonction utilitaire pour afficher le statut d'éligibilité
  const renderEligibilityStatus = (fishFarmer: IFishFarmer) => {
    if (!fishFarmer.eligibility_status) return '-';
    let color: 'success' | 'danger' | 'warning' = 'success';
    let label = '';
    switch (fishFarmer.eligibility_status) {
      case 'GO':
        color = 'success';
        label = 'Go';
        break;
      case 'NON_GO':
        color = 'danger';
        label = 'Non Go';
        break;
      case 'NON_GO_CONDITIONNE':
        color = 'warning';
        label = 'Non Go conditionné';
        break;
      default:
        label = '-';
    }
    return (
      <div className="flex flex-col items-start">
        <Chip color={color} size="sm" variant="flat">{label}</Chip>
        {fishFarmer.eligibility_status === 'NON_GO' && fishFarmer.eligibility_reason && (
          <span className="text-xs text-red-500 mt-1">{fishFarmer.eligibility_reason}</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!fishFarmer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-20">
        <h2 className="text-xl font-bold text-gray-600 mb-4">Pisciculteur non trouvé</h2>
        <Button color="primary" onPress={() => navigate('/admin/pisciculteurs')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="light"
            onPress={() => navigate('/admin/pisciculteurs')}
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails du pisciculteur</h1>
        </div>
        <div className="flex gap-2">
          <Button
            color="primary"
            startContent={<Edit className="w-4 h-4" />}
            onPress={handleEdit}
          >
            Modifier
          </Button>
          <Button
            color="danger"
            startContent={<Trash2 className="w-4 h-4" />}
            onPress={handleDelete}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Informations personnelles</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <p className="text-gray-900">{fishFarmer.nom}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <p className="text-gray-900">{fishFarmer.prenom}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <p className="text-gray-900">{fishFarmer.telephone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{fishFarmer.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <Chip
                color={statusColorMap[fishFarmer.status]}
                size="sm"
                variant="flat"
              >
                {fishFarmer.status}
              </Chip>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte actif</label>
              <Chip
                color={fishFarmer.compte_actif ? "success" : "default"}
                size="sm"
                variant="flat"
              >
                {fishFarmer.compte_actif ? "Oui" : "Non"}
              </Chip>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut d'éligibilité</label>
              {renderEligibilityStatus(fishFarmer)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score d'éligibilité</label>
              <Chip
                color={calculateEligibilityScore(fishFarmer) >= 70 ? "success" : calculateEligibilityScore(fishFarmer) >= 50 ? "warning" : "danger"}
                size="sm"
                variant="flat"
              >
                {calculateEligibilityScore(fishFarmer)}%
              </Chip>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
              <p className="text-gray-900">{fishFarmer.region?.nom || 'Non assigné'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
              <p className="text-gray-900">{fishFarmer.region?.departement?.nom || 'Non spécifié'}</p>
            </div>
            {fishFarmer.derniereConnexion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dernière connexion</label>
                <p className="text-gray-900">{new Date(fishFarmer.derniereConnexion).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button
              color="primary"
              startContent={<Edit className="w-4 h-4" />}
              onPress={handleStatusUpdate}
            >
              Gérer le statut
            </Button>
            <Button
              color="secondary"
              startContent={<Activity className="w-4 h-4" />}
              onPress={handleViewActivities}
            >
              Voir les activités
            </Button>
            <Button
              color="success"
              startContent={<Fish className="w-4 h-4" />}
              onPress={handleViewBasins}
            >
              Voir les bassins
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Modal de gestion du statut */}
      {isStatusModalOpen && fishFarmer && (
        <StatusModal
          fishFarmer={fishFarmer}
          onClose={onStatusModalClose}
          onUpdate={updateStatus}
        />
      )}

      {/* Modal des activités */}
      {isActivityModalOpen && fishFarmer && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={onActivityModalClose}
          fishFarmer={fishFarmer}
        />
      )}

      {/* Modal des bassins */}
      {isBasinsModalOpen && fishFarmer && (
        <BasinsModal
          isOpen={isBasinsModalOpen}
          onClose={onBasinsModalClose}
          fishFarmer={fishFarmer}
          onUnassignBasin={handleUnassignBasin}
        />
      )}

      {/* Modal d'édition */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmitEdit}>
            <ModalHeader>Modifier le pisciculteur</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nom"
                  value={editForm.nom}
                  onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                  required
                />
                <Input
                  label="Prénom"
                  value={editForm.prenom}
                  onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                  required
                />
                <Input
                  label="Téléphone"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({...editForm, telephone: e.target.value})}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
                <Select
                  label="Région"
                  selectedKeys={editForm.region_id ? [editForm.region_id] : []}
                  onSelectionChange={(keys) => setEditForm({...editForm, region_id: Array.from(keys)[0] as string})}
                  isLoading={loadingRegions}
                >
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onEditModalClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Sauvegarder
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

// Composant StatusModal
const StatusModal: React.FC<{
  fishFarmer: IFishFarmer;
  onClose: () => void;
  onUpdate: (id: number, statusData: IUpdateFishFarmerStatus) => Promise<void>;
}> = ({ fishFarmer, onClose, onUpdate }) => {
  const [statusData, setStatusData] = useState({
    status: fishFarmer.status,
    compte_actif: fishFarmer.compte_actif,
    eligible_soa: fishFarmer.eligible_soa,
  });

  const handleSubmit = async () => {
    try {
      await onUpdate(fishFarmer.id, statusData);
      toast.success('Statut mis à jour avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Gérer le statut de {fishFarmer.nom} {fishFarmer.prenom}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Select
              label="Statut"
              selectedKeys={[statusData.status]}
              onSelectionChange={(keys) => setStatusData({...statusData, status: Array.from(keys)[0] as 'actif' | 'inactif'})}
            >
              <SelectItem key="actif" value="actif">Actif</SelectItem>
              <SelectItem key="inactif" value="inactif">Inactif</SelectItem>
            </Select>
            <div className="flex items-center justify-between">
              <span>Compte actif</span>
              <Switch
                isSelected={statusData.compte_actif}
                onValueChange={(value) => setStatusData({...statusData, compte_actif: value})}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Éligible SOA</span>
              <Switch
                isSelected={statusData.eligible_soa}
                onValueChange={(value) => setStatusData({...statusData, eligible_soa: value})}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Mettre à jour
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Composant BasinsModal
const BasinsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  fishFarmer: IFishFarmer;
  onUnassignBasin: (basinId: number, fishFarmerId: number) => Promise<void>;
}> = ({ isOpen, onClose, fishFarmer, onUnassignBasin }) => {
  const { fishFarmerBasins } = useFishFarmerStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Bassins assignés à {fishFarmer.nom} {fishFarmer.prenom}</ModalHeader>
        <ModalBody>
          {fishFarmerBasins.length > 0 ? (
            <div className="space-y-4">
              {fishFarmerBasins.map((basin) => (
                <div key={basin.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{basin.nom}</h3>
                      <p className="text-sm text-gray-500">{basin.type} - {basin.superficie} m²</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aucun bassin assigné à ce pisciculteur
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FishFarmerDetailsPage; 