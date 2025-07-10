import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IBassin, IUpdateBassin } from '../types/waterBasin';
import { useWaterBasinStore } from '../../store/waterBasinStore';
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
} from "@heroui/react";
import { Edit, Trash2, UserPlus, UserMinus, ArrowLeft, Save, X, Plus } from 'lucide-react';
import { fetchRegions } from '../../api/regions';
import { getActiveFishFarmers } from '../../api/services/fishFarmerService';
import { IFishFarmer } from '../types/fishFarmer';

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  EN_MAINTENANCE: "warning",
  INACTIF: "danger",
};

interface Region {
  id: number;
  nom: string;
}

const BassinDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    bassins, 
    fetchBassins, 
    updateBassin, 
    deleteBassin,
    assignBassin,
    unassignBassin
  } = useWaterBasinStore();
  
  const [bassin, setBassin] = useState<IBassin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: '',
    superficie: '',
    profondeur: '',
    type: '',
    statut: '',
    region_id: '',
    capacite_max: '',
    type_poisson: '',
    description: '',
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [fishFarmers, setFishFarmers] = useState<IFishFarmer[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingFishFarmers, setLoadingFishFarmers] = useState(false);
  const { isOpen: isAssignModalOpen, onOpen: onAssignModalOpen, onClose: onAssignModalClose } = useDisclosure();
  const [selectedFishFarmerId, setSelectedFishFarmerId] = useState<string>('');
  
  // États pour les modals des calendriers
  const { isOpen: isRecolteModalOpen, onOpen: onRecolteModalOpen, onClose: onRecolteModalClose } = useDisclosure();
  const { isOpen: isIntrantModalOpen, onOpen: onIntrantModalOpen, onClose: onIntrantModalClose } = useDisclosure();
  
  // États pour les formulaires des calendriers
  const [recolteForm, setRecolteForm] = useState({
    date_recolte_prevue: '',
    quantite_prevue: '',
    type_poisson: '',
    observations: '',
  });
  
  const [intrantForm, setIntrantForm] = useState({
    date_avance_prevue: '',
    montant_avance: '',
    type_intrant: '',
    quantite_intrant: '',
    observations: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchBassins();
      setIsLoading(false);
    };
    loadData();
  }, [fetchBassins]);

  useEffect(() => {
    if (bassins.length > 0 && id) {
      const foundBassin = bassins.find(b => b.id === parseInt(id));
      if (foundBassin) {
        setBassin(foundBassin);
        setEditForm({
          nom: foundBassin.nom || '',
          superficie: foundBassin.superficie?.toString() || '',
          profondeur: foundBassin.profondeur?.toString() || '',
          type: foundBassin.type || '',
          statut: foundBassin.statut || '',
          region_id: foundBassin.region?.id?.toString() || '',
          capacite_max: foundBassin.capacite_max?.toString() || '',
          type_poisson: foundBassin.type_poisson || '',
          description: foundBassin.description || '',
        });
      }
    }
  }, [bassins, id]);

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

  useEffect(() => {
    const loadFishFarmers = async () => {
      setLoadingFishFarmers(true);
      try {
        const fishFarmersData = await getActiveFishFarmers();
        setFishFarmers(fishFarmersData);
      } catch (error) {
        console.error('Erreur lors du chargement des pisciculteurs:', error);
      } finally {
        setLoadingFishFarmers(false);
      }
    };
    loadFishFarmers();
  }, []);

  const handleSave = async () => {
    if (!bassin) return;
    
    try {
      const updateData: IUpdateBassin = {
        nom: editForm.nom,
        superficie: Number(editForm.superficie),
        profondeur: Number(editForm.profondeur),
        type: editForm.type,
        statut: editForm.statut as any,
        capacite_max: editForm.capacite_max ? Number(editForm.capacite_max) : undefined,
        type_poisson: editForm.type_poisson || undefined,
        description: editForm.description || undefined,
      };
      await updateBassin(bassin.id, updateData);
      toast.success('Bassin modifié avec succès');
      setIsEditing(false);
      await fetchBassins(); // Recharger les données
    } catch (error) {
      toast.error('Erreur lors de la modification du bassin');
    }
  };

  const handleDelete = async () => {
    if (!bassin || !confirm('Êtes-vous sûr de vouloir supprimer ce bassin ?')) return;
    
    try {
      await deleteBassin(bassin.id);
      toast.success('Bassin supprimé avec succès');
      navigate('/admin/bassins');
    } catch (error) {
      toast.error('Erreur lors de la suppression du bassin');
    }
  };

  const handleAssign = async () => {
    if (!bassin || !selectedFishFarmerId) return;
    
    try {
      await assignBassin({
        bassin_id: bassin.id,
        pisciculteur_id: Number(selectedFishFarmerId)
      });
      toast.success('Bassin assigné avec succès');
      onAssignModalClose();
      setSelectedFishFarmerId('');
      await fetchBassins(); // Recharger les données
    } catch (error) {
      toast.error('Erreur lors de l\'assignation du bassin');
    }
  };

  const handleUnassign = async () => {
    if (!bassin || !bassin.pisciculteur_assigne) return;
    
    if (confirm('Êtes-vous sûr de vouloir désassigner ce bassin ?')) {
      try {
        await unassignBassin(bassin.id, bassin.pisciculteur_assigne.id);
        toast.success('Bassin désassigné avec succès');
        await fetchBassins(); // Recharger les données
      } catch (error) {
        toast.error('Erreur lors de la désassignation du bassin');
      }
    }
  };

  // Fonctions pour les calendriers
  const handleAddRecolte = () => {
    setRecolteForm({
      date_recolte_prevue: '',
      quantite_prevue: '',
      type_poisson: '',
      observations: '',
    });
    onRecolteModalOpen();
  };

  const handleAddIntrant = () => {
    setIntrantForm({
      date_avance_prevue: '',
      montant_avance: '',
      type_intrant: '',
      quantite_intrant: '',
      observations: '',
    });
    onIntrantModalOpen();
  };

  const handleSubmitRecolte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bassin) return;

    try {
      // Simulation d'ajout (mock data)
      const newRecolte = {
        id: Date.now(),
        date_recolte_prevue: recolteForm.date_recolte_prevue,
        quantite_prevue: Number(recolteForm.quantite_prevue),
        type_poisson: recolteForm.type_poisson,
        observations: recolteForm.observations,
        statut: 'PLANIFIE' as const,
        date_creation: new Date().toISOString(),
      };

      // Ici vous ajouteriez l'appel API réel
      console.log('Nouvelle récolte à ajouter:', newRecolte);
      
      toast.success('Récolte planifiée avec succès');
      onRecolteModalClose();
      
      // Recharger les données (simulation)
      await fetchBassins();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la récolte');
    }
  };

  const handleSubmitIntrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bassin) return;

    try {
      // Simulation d'ajout (mock data)
      const newIntrant = {
        id: Date.now(),
        date_avance_prevue: intrantForm.date_avance_prevue,
        montant_avance: Number(intrantForm.montant_avance),
        type_intrant: intrantForm.type_intrant,
        quantite_intrant: Number(intrantForm.quantite_intrant),
        observations: intrantForm.observations,
        statut: 'PLANIFIE' as const,
        date_creation: new Date().toISOString(),
      };

      // Ici vous ajouteriez l'appel API réel
      console.log('Nouvel intrant à ajouter:', newIntrant);
      
      toast.success('Avance sur intrants planifiée avec succès');
      onIntrantModalClose();
      
      // Recharger les données (simulation)
      await fetchBassins();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'avance sur intrants');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bassin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-20">
        <h2 className="text-xl font-bold text-gray-600 mb-4">Bassin non trouvé</h2>
        <Button color="primary" onPress={() => navigate('/admin/bassins')}>
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
            onPress={() => navigate('/admin/bassins')}
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails du bassin</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                color="primary"
                startContent={<Edit className="w-4 h-4" />}
                onPress={() => setIsEditing(true)}
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
            </>
          ) : (
            <>
              <Button
                color="success"
                startContent={<Save className="w-4 h-4" />}
                onPress={handleSave}
              >
                Sauvegarder
              </Button>
              <Button
                color="default"
                startContent={<X className="w-4 h-4" />}
                onPress={() => setIsEditing(false)}
              >
                Annuler
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Informations générales</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              {isEditing ? (
                <Input
                  value={editForm.nom}
                  onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                  placeholder="Nom du bassin"
                />
              ) : (
                <p className="text-gray-900">{bassin.nom}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Superficie</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editForm.superficie}
                  onChange={(e) => setEditForm({...editForm, superficie: e.target.value})}
                  placeholder="Superficie en m²"
                />
              ) : (
                <p className="text-gray-900">{bassin.superficie} m²</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profondeur</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editForm.profondeur}
                  onChange={(e) => setEditForm({...editForm, profondeur: e.target.value})}
                  placeholder="Profondeur en m"
                />
              ) : (
                <p className="text-gray-900">{bassin.profondeur} m</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              {isEditing ? (
                <Input
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  placeholder="Type de bassin"
                />
              ) : (
                <p className="text-gray-900">{bassin.type || 'Non spécifié'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ferme</label>
              <p className="text-gray-900">{bassin.ferme || 'Non spécifiée'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              {isEditing ? (
                <Select
                  selectedKeys={[editForm.statut]}
                  onSelectionChange={(keys) => setEditForm({...editForm, statut: Array.from(keys)[0] as string})}
                >
                  <SelectItem key="ACTIF" value="ACTIF">Actif</SelectItem>
                  <SelectItem key="EN_MAINTENANCE" value="EN_MAINTENANCE">En maintenance</SelectItem>
                  <SelectItem key="INACTIF" value="INACTIF">Inactif</SelectItem>
                </Select>
              ) : (
                <Chip
                  color={statusColorMap[bassin.statut]}
                  size="sm"
                  variant="flat"
                >
                  {bassin.statut}
                </Chip>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
              {isEditing ? (
                <Select
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
              ) : (
                <p className="text-gray-900">{bassin.region?.nom || 'Non assigné'}</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Informations supplémentaires</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité maximale</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editForm.capacite_max}
                  onChange={(e) => setEditForm({...editForm, capacite_max: e.target.value})}
                  placeholder="Capacité maximale"
                />
              ) : (
                <p className="text-gray-900">{bassin.capacite_max ? `${bassin.capacite_max} unités` : 'Non spécifiée'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de poisson</label>
              {isEditing ? (
                <Input
                  value={editForm.type_poisson}
                  onChange={(e) => setEditForm({...editForm, type_poisson: e.target.value})}
                  placeholder="Type de poisson"
                />
              ) : (
                <p className="text-gray-900">{bassin.type_poisson || 'Non spécifié'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              {isEditing ? (
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  placeholder="Description du bassin"
                />
              ) : (
                <p className="text-gray-900">{bassin.description || 'Aucune description'}</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Informations système */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Informations système</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
              <p className="text-gray-900">{new Date(bassin.date_creation).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dernière modification</label>
              <p className="text-gray-900">{bassin.updated_at ? new Date(bassin.updated_at).toLocaleDateString('fr-FR') : 'Non disponible'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
              <p className="text-gray-900">{bassin.admin_id || 'Non spécifié'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
              <p className="text-gray-900">{bassin.region?.departement?.nom || 'Non spécifié'}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Pisciculteur assigné */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pisciculteur assigné</h2>
            {bassin.pisciculteur_assigne ? (
              <Button
                color="warning"
                startContent={<UserMinus className="w-4 h-4" />}
                onPress={handleUnassign}
              >
                Désassigner
              </Button>
            ) : (
              <Button
                color="primary"
                startContent={<UserPlus className="w-4 h-4" />}
                onPress={onAssignModalOpen}
              >
                Assigner
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {bassin.pisciculteur_assigne ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {bassin.pisciculteur_assigne.nom.charAt(0)}{bassin.pisciculteur_assigne.prenom.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{bassin.pisciculteur_assigne.nom} {bassin.pisciculteur_assigne.prenom}</p>
                <p className="text-sm text-gray-500">Pisciculteur assigné</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Aucun pisciculteur assigné</p>
          )}
        </CardBody>
      </Card>

      {/* Modal d'assignation */}
      <Modal isOpen={isAssignModalOpen} onClose={onAssignModalClose}>
        <ModalContent>
          <ModalHeader>Assigner un pisciculteur</ModalHeader>
          <ModalBody>
            <Select
              label="Pisciculteur"
              selectedKeys={selectedFishFarmerId ? [selectedFishFarmerId] : []}
              onSelectionChange={(keys) => setSelectedFishFarmerId(Array.from(keys)[0] as string)}
              isLoading={loadingFishFarmers}
            >
              {fishFarmers.map(fishFarmer => (
                <SelectItem key={fishFarmer.id} value={fishFarmer.id}>
                  {fishFarmer.nom} {fishFarmer.prenom}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onAssignModalClose}>
              Annuler
            </Button>
            <Button color="primary" onPress={handleAssign}>
              Assigner
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Performances */}
      {bassin.performances && bassin.performances.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Performances</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {bassin.performances.map((performance, index) => (
                <div key={performance.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de poissons</label>
                      <p className="text-gray-900">{performance.nombre_poissons}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poids total</label>
                      <p className="text-gray-900">{performance.poids_total} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poids moyen</label>
                      <p className="text-gray-900">{performance.poids_moyen} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taux de mortalité</label>
                      <p className="text-gray-900">{performance.taux_mortalite}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taux de croissance</label>
                      <p className="text-gray-900">{performance.taux_croissance}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de mesure</label>
                      <p className="text-gray-900">{new Date(performance.date_mesure).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  {performance.observations && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                      <p className="text-gray-900">{performance.observations}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pêches de contrôle */}
      {bassin.peches_controle && bassin.peches_controle.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Pêches de contrôle</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {bassin.peches_controle.map((peche, index) => (
                <div key={peche.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de poissons pêchés</label>
                      <p className="text-gray-900">{peche.nombre_poissons_peches}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poids total pêche</label>
                      <p className="text-gray-900">{peche.poids_total_peche} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poids moyen par poisson</label>
                      <p className="text-gray-900">{peche.poids_moyen_poisson} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de pêche</label>
                      <p className="text-gray-900">{new Date(peche.date_peche).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {peche.taille_moyenne && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Taille moyenne</label>
                        <p className="text-gray-900">{peche.taille_moyenne} cm</p>
                      </div>
                    )}
                    {peche.etat_sante && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">État de santé</label>
                        <p className="text-gray-900">{peche.etat_sante}</p>
                      </div>
                    )}
                    {peche.methode_peche && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de pêche</label>
                        <p className="text-gray-900">{peche.methode_peche}</p>
                      </div>
                    )}
                  </div>
                  {peche.observations && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                      <p className="text-gray-900">{peche.observations}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Calendrier de récolte */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Calendrier de récolte</h2>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleAddRecolte}
            >
              Ajouter une récolte
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {bassin.calendrier_recolte && bassin.calendrier_recolte.length > 0 ? (
              bassin.calendrier_recolte.map((recolte, index) => (
                <div key={recolte.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de récolte prévue</label>
                      <p className="text-gray-900">{new Date(recolte.date_recolte_prevue).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité prévue</label>
                      <p className="text-gray-900">{recolte.quantite_prevue} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type de poisson</label>
                      <p className="text-gray-900">{recolte.type_poisson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <Chip
                        color={
                          recolte.statut === 'TERMINE' ? 'success' :
                          recolte.statut === 'EN_COURS' ? 'warning' :
                          recolte.statut === 'ANNULE' ? 'danger' : 'default'
                        }
                        size="sm"
                        variant="flat"
                      >
                        {recolte.statut}
                      </Chip>
                    </div>
                  </div>
                  {recolte.observations && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                      <p className="text-gray-900">{recolte.observations}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune récolte planifiée pour ce bassin</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Calendrier d'intrants */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Calendrier d'avances sur intrants</h2>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleAddIntrant}
            >
              Ajouter une avance
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {bassin.calendrier_intrants && bassin.calendrier_intrants.length > 0 ? (
              bassin.calendrier_intrants.map((intrant, index) => (
                <div key={intrant.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'avance prévue</label>
                      <p className="text-gray-900">{new Date(intrant.date_avance_prevue).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Montant d'avance</label>
                      <p className="text-gray-900">{intrant.montant_avance.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type d'intrant</label>
                      <p className="text-gray-900">{intrant.type_intrant}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité d'intrant</label>
                      <p className="text-gray-900">{intrant.quantite_intrant} unités</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <Chip
                        color={
                          intrant.statut === 'DELIVRE' ? 'success' :
                          intrant.statut === 'APPROUVE' ? 'warning' :
                          intrant.statut === 'ANNULE' ? 'danger' : 'default'
                        }
                        size="sm"
                        variant="flat"
                      >
                        {intrant.statut}
                      </Chip>
                    </div>
                  </div>
                  {intrant.observations && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                      <p className="text-gray-900">{intrant.observations}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune avance sur intrants planifiée pour ce bassin</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Modal pour ajouter une récolte */}
      <Modal isOpen={isRecolteModalOpen} onClose={onRecolteModalClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmitRecolte}>
            <ModalHeader>Planifier une récolte</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  type="date"
                  label="Date de récolte prévue"
                  value={recolteForm.date_recolte_prevue}
                  onChange={(e) => setRecolteForm({...recolteForm, date_recolte_prevue: e.target.value})}
                  required
                />
                <Input
                  type="number"
                  label="Quantité prévue (kg)"
                  value={recolteForm.quantite_prevue}
                  onChange={(e) => setRecolteForm({...recolteForm, quantite_prevue: e.target.value})}
                  placeholder="Ex: 500"
                  required
                />
                <Input
                  label="Type de poisson"
                  value={recolteForm.type_poisson}
                  onChange={(e) => setRecolteForm({...recolteForm, type_poisson: e.target.value})}
                  placeholder="Ex: Tilapia, Carpe..."
                  required
                />
                <Input
                  label="Observations"
                  value={recolteForm.observations}
                  onChange={(e) => setRecolteForm({...recolteForm, observations: e.target.value})}
                  placeholder="Observations optionnelles"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onRecolteModalClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Planifier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal pour ajouter une avance sur intrants */}
      <Modal isOpen={isIntrantModalOpen} onClose={onIntrantModalClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmitIntrant}>
            <ModalHeader>Planifier une avance sur intrants</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  type="date"
                  label="Date d'avance prévue"
                  value={intrantForm.date_avance_prevue}
                  onChange={(e) => setIntrantForm({...intrantForm, date_avance_prevue: e.target.value})}
                  required
                />
                <Input
                  type="number"
                  label="Montant d'avance (FCFA)"
                  value={intrantForm.montant_avance}
                  onChange={(e) => setIntrantForm({...intrantForm, montant_avance: e.target.value})}
                  placeholder="Ex: 50000"
                  required
                />
                <Input
                  label="Type d'intrant"
                  value={intrantForm.type_intrant}
                  onChange={(e) => setIntrantForm({...intrantForm, type_intrant: e.target.value})}
                  placeholder="Ex: Aliments, Médicaments, Équipements..."
                  required
                />
                <Input
                  type="number"
                  label="Quantité d'intrant"
                  value={intrantForm.quantite_intrant}
                  onChange={(e) => setIntrantForm({...intrantForm, quantite_intrant: e.target.value})}
                  placeholder="Ex: 100"
                  required
                />
                <Input
                  label="Observations"
                  value={intrantForm.observations}
                  onChange={(e) => setIntrantForm({...intrantForm, observations: e.target.value})}
                  placeholder="Observations optionnelles"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onIntrantModalClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Planifier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BassinDetailsPage; 