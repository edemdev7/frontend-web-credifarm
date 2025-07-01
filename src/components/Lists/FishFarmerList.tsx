import { FC, useEffect, useState, useCallback, useMemo } from "react";
import { IFishFarmer, INewFishFarmer, IUpdateFishFarmerStatus } from "../types/fishFarmer";
import { useFishFarmerStore } from "../../store/fishFarmerStore";
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure, Pagination, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Switch, Textarea } from "@heroui/react";
import toast from "react-hot-toast";
import { fetchRegions } from "../../api/regions";
import { fetchDepartments } from "../../api/department";
import ActivityModal from "../Activity/ActivityModal";

const COLUMNS = [
  { name: "ID", uid: "id" },
  { name: "Nom", uid: "nom", sortable: true },
  { name: "Prénom", uid: "prenom", sortable: true },
  { name: "Téléphone", uid: "telephone" },
  { name: "Email", uid: "email" },
  { name: "Statut", uid: "status" },
  { name: "Compte Actif", uid: "compte_actif" },
  { name: "Éligible SOA", uid: "eligible_soa" },
  { name: "Score Éligibilité", uid: "eligibility_score" },
  { name: "Région", uid: "region" },
  { name: "Actions", uid: "actions" },
];

const ROWS_PER_PAGE = 8;

// Calculer le score d'éligibilité (non lié à l'API)
const calculateEligibilityScore = (fishFarmer: IFishFarmer) => {
  let score = 0;
  
  // Critères d'éligibilité
  if (fishFarmer.compte_actif) score += 30;
  if (fishFarmer.eligible_soa) score += 25;
  if (fishFarmer.status === 'actif') score += 20;
  if (fishFarmer.derniereConnexion) score += 15;
  if (fishFarmer.region) score += 10;
  
  return Math.min(score, 100);
};

const FishFarmerList: FC = () => {
  const { 
    fishFarmers, 
    fishFarmerBasins,
    loading, 
    error,
    fetchAllFishFarmers, 
    deleteFishFarmerData,
    updateStatus,
    unassignBasin,
    fetchFishFarmerBasins
  } = useFishFarmerStore();
  
  // Ajout log debug affichage dans useEffect pour éviter le warning React
  useEffect(() => {
    console.log('fishFarmers (depuis store):', fishFarmers);
  }, [fishFarmers]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isBasinsModalOpen, setIsBasinsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedFishFarmer, setSelectedFishFarmer] = useState<IFishFarmer | null>(null);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [compteActifFilter, setCompteActifFilter] = useState<'all' | 'true' | 'false'>('all');
  const [eligibleSoaFilter, setEligibleSoaFilter] = useState<'all' | 'true' | 'false'>('all');
  const [departments, setDepartments] = useState<{ id: number; nom: string; regions: any[] }[]>([]);
  const [regions, setRegions] = useState<{ id: number; nom: string }[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<number | "">("");
  const [regionFilter, setRegionFilter] = useState<number | "">("");

  useEffect(() => {
    fetchAllFishFarmers();
    fetchDepartments().then(setDepartments);
  }, [fetchAllFishFarmers]);

  useEffect(() => {
    if (departmentFilter) {
      const selectedDepartment = departments.find(d => d.id === departmentFilter);
      if (selectedDepartment) {
        setRegions(selectedDepartment.regions);
      } else {
        setRegions([]);
      }
    } else {
      setRegions([]);
      setRegionFilter("");
    }
  }, [departmentFilter, departments]);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedFishFarmer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fishFarmer: IFishFarmer) => {
    setModalMode('edit');
    setSelectedFishFarmer(fishFarmer);
    setIsModalOpen(true);
  };

  const handleView = (fishFarmer: IFishFarmer) => {
    setModalMode('view');
    setSelectedFishFarmer(fishFarmer);
    setIsModalOpen(true);
  };

  const handleDelete = async (fishFarmer: IFishFarmer) => {
    if (!window.confirm("Supprimer ce pisciculteur ?")) return;
    try {
      await deleteFishFarmerData(fishFarmer.id);
      toast.success("Pisciculteur supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleStatusUpdate = (fishFarmer: IFishFarmer) => {
    setSelectedFishFarmer(fishFarmer);
    setIsStatusModalOpen(true);
  };

  const handleViewActivities = (fishFarmer: IFishFarmer) => {
    setSelectedFishFarmer(fishFarmer);
    setIsActivityModalOpen(true);
  };

  const handleViewBasins = async (fishFarmer: IFishFarmer) => {
    setSelectedFishFarmer(fishFarmer);
    await fetchFishFarmerBasins(fishFarmer.id);
    setIsBasinsModalOpen(true);
  };

  const handleUnassignBasin = async (basinId: number, fishFarmerId: number) => {
    if (!window.confirm("Désassigner ce bassin du pisciculteur ?")) return;
    try {
      await unassignBasin(basinId, fishFarmerId);
      toast.success("Bassin désassigné avec succès");
      // Recharger les bassins du pisciculteur
      await fetchFishFarmerBasins(fishFarmerId);
    } catch {
      toast.error("Erreur lors de la désassignation");
    }
  };

  const paginated = useMemo(() => {
    let filtered = fishFarmers;
    
    // Filtres
    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }
    if (compteActifFilter !== 'all') {
      filtered = filtered.filter(f => f.compte_actif === (compteActifFilter === 'true'));
    }
    if (eligibleSoaFilter !== 'all') {
      filtered = filtered.filter(f => f.eligible_soa === (eligibleSoaFilter === 'true'));
    }
    if (departmentFilter) {
      filtered = filtered.filter(f => f.region?.departement?.id === departmentFilter);
    }
    if (regionFilter) {
      filtered = filtered.filter(f => f.region?.id === regionFilter);
    }
    if (filterValue) {
      filtered = filtered.filter(f =>
        f.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
        f.prenom.toLowerCase().includes(filterValue.toLowerCase()) ||
        f.telephone.toLowerCase().includes(filterValue.toLowerCase()) ||
        f.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    const start = (page - 1) * ROWS_PER_PAGE;
    return filtered.slice(start, start + ROWS_PER_PAGE);
  }, [fishFarmers, filterValue, page, statusFilter, compteActifFilter, eligibleSoaFilter, departmentFilter, regionFilter]);

  const getStatusChip = (status: string) => {
    return status === 'actif' ? (
      <Chip color="success" variant="flat">Actif</Chip>
    ) : (
      <Chip color="danger" variant="flat">Inactif</Chip>
    );
  };

  const getBooleanChip = (value: boolean) => {
    return value ? (
      <Chip color="success" variant="flat" size="sm">Oui</Chip>
    ) : (
      <Chip color="default" variant="flat" size="sm">Non</Chip>
    );
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <Input
          placeholder="Rechercher..."
          value={filterValue}
          onValueChange={setFilterValue}
          className="max-w-xs"
        />
        
        {/* Filtres */}
        <select 
          className="border rounded p-2" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value as 'all' | 'actif' | 'inactif')}
        >
          <option value="all">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        
        <select 
          className="border rounded p-2" 
          value={compteActifFilter} 
          onChange={e => setCompteActifFilter(e.target.value as 'all' | 'true' | 'false')}
        >
          <option value="all">Tous les comptes</option>
          <option value="true">Compte actif</option>
          <option value="false">Compte inactif</option>
        </select>
        
        <select 
          className="border rounded p-2" 
          value={eligibleSoaFilter} 
          onChange={e => setEligibleSoaFilter(e.target.value as 'all' | 'true' | 'false')}
        >
          <option value="all">Toutes éligibilités</option>
          <option value="true">Éligible SOA</option>
          <option value="false">Non éligible SOA</option>
        </select>
        
        <select 
          className="border rounded p-2" 
          value={departmentFilter} 
          onChange={e => setDepartmentFilter(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">Tous les départements</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
        </select>
        
        <select 
          className="border rounded p-2" 
          value={regionFilter} 
          onChange={e => setRegionFilter(e.target.value ? Number(e.target.value) : "")} 
          disabled={!departmentFilter}
        >
          <option value="">Toutes les régions</option>
          {regions.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
        </select>
        
        <Button color="primary" onClick={handleCreate}>Ajouter</Button>
      </div>
      
      <Table
        aria-label="Liste des pisciculteurs"
        isHeaderSticky
        bottomContent={
          <Pagination 
            page={page} 
            total={Math.ceil(fishFarmers.length / ROWS_PER_PAGE)} 
            onChange={setPage} 
          />
        }
      >
        <TableHeader columns={COLUMNS}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner />}
          items={paginated}
        >
          {(fishFarmer) => (
            <TableRow key={fishFarmer.id}>
              <TableCell>{fishFarmer.id}</TableCell>
              <TableCell>{fishFarmer.nom}</TableCell>
              <TableCell>{fishFarmer.prenom}</TableCell>
              <TableCell>{fishFarmer.telephone}</TableCell>
              <TableCell>{fishFarmer.email}</TableCell>
              <TableCell>{getStatusChip(fishFarmer.status)}</TableCell>
              <TableCell>{getBooleanChip(fishFarmer.compte_actif)}</TableCell>
              <TableCell>{getBooleanChip(fishFarmer.eligible_soa)}</TableCell>
              <TableCell>
                <Chip 
                  color={calculateEligibilityScore(fishFarmer) >= 70 ? "success" : calculateEligibilityScore(fishFarmer) >= 50 ? "warning" : "danger"} 
                  variant="flat" 
                  size="sm"
                >
                  {calculateEligibilityScore(fishFarmer)}%
                </Chip>
              </TableCell>
              <TableCell>{fishFarmer.region?.nom || '-'}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="view" onPress={() => handleView(fishFarmer)}>
                      Voir
                    </DropdownItem>
                    <DropdownItem key="edit" onPress={() => handleEdit(fishFarmer)}>
                      Modifier
                    </DropdownItem>
                    <DropdownItem key="status" onPress={() => handleStatusUpdate(fishFarmer)}>
                      Gérer statut
                    </DropdownItem>
                    <DropdownItem key="viewActivities" onPress={() => handleViewActivities(fishFarmer)}>
                      Voir activités
                    </DropdownItem>
                    <DropdownItem key="viewBasins" onPress={() => handleViewBasins(fishFarmer)}>
                      Voir bassins
                    </DropdownItem>
                    <DropdownItem key="delete" className="text-danger" onPress={() => handleDelete(fishFarmer)}>
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {isModalOpen && (
        <FishFarmerModal
          mode={modalMode}
          fishFarmer={selectedFishFarmer}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchAllFishFarmers}
        />
      )}
      
      {isStatusModalOpen && selectedFishFarmer && (
        <StatusModal
          fishFarmer={selectedFishFarmer}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdate={updateStatus}
        />
      )}
      
      {isActivityModalOpen && selectedFishFarmer && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          fishFarmer={selectedFishFarmer}
        />
      )}
      
      {isBasinsModalOpen && selectedFishFarmer && (
        <BasinsModal
          isOpen={isBasinsModalOpen}
          onClose={() => setIsBasinsModalOpen(false)}
          fishFarmer={selectedFishFarmer}
          onUnassignBasin={handleUnassignBasin}
        />
      )}
    </div>
  );
};

// Modal pour la gestion du statut et de l'éligibilité
const StatusModal: FC<{
  fishFarmer: IFishFarmer;
  onClose: () => void;
  onUpdate: (id: number, statusData: IUpdateFishFarmerStatus) => Promise<void>;
}> = ({ fishFarmer, onClose, onUpdate }) => {
  const [statusData, setStatusData] = useState<IUpdateFishFarmerStatus>({
    compte_actif: fishFarmer.compte_actif,
    eligible_soa: fishFarmer.eligible_soa,
    raison_desactivation: fishFarmer.raison_desactivation || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate(fishFarmer.id, statusData);
      toast.success("Statut mis à jour avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Gérer le statut de {fishFarmer.prenom} {fishFarmer.nom}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Compte actif</span>
              <Switch
                isSelected={statusData.compte_actif}
                onValueChange={(value) => setStatusData(prev => ({ ...prev, compte_actif: value }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Éligible SOA</span>
              <Switch
                isSelected={statusData.eligible_soa}
                onValueChange={(value) => setStatusData(prev => ({ ...prev, eligible_soa: value }))}
              />
            </div>
            
            {!statusData.compte_actif && (
              <div>
                <label className="block text-sm font-medium mb-2">Raison de désactivation</label>
                <Textarea
                  value={statusData.raison_desactivation}
                  onChange={(e) => setStatusData(prev => ({ ...prev, raison_desactivation: e.target.value }))}
                  placeholder="Raison de la désactivation..."
                  rows={3}
                />
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Annuler</Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Enregistrer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Modal composant (création, édition, vue)
const FishFarmerModal: FC<{ 
  mode: 'create' | 'edit' | 'view'; 
  fishFarmer: IFishFarmer | null; 
  onClose: () => void; 
  onRefresh: () => void 
}> = ({ mode, fishFarmer, onClose, onRefresh }) => {
  const { createNewFishFarmer, updateFishFarmerData } = useFishFarmerStore();
  
  // Initialiser le formulaire avec toutes les données du pisciculteur existant
  const [form, setForm] = useState<INewFishFarmer>(() => {
    if (mode === 'edit' && fishFarmer) {
      console.log('Initialisation formulaire édition avec:', fishFarmer);
      return {
        username: fishFarmer.username || '',
        email: fishFarmer.email || '',
        password: '', // Pas de mot de passe en édition
        prenom: fishFarmer.prenom || '',
        nom: fishFarmer.nom || '',
        telephone: fishFarmer.telephone || '',
        roleId: fishFarmer.roleId || 2, // PISCICULTEUR
        region_id: fishFarmer.region?.id || undefined,
        department_id: fishFarmer.region?.departement?.id || undefined,
      };
    } else {
      return {
        username: '',
        email: '',
        password: '',
        prenom: '',
        nom: '',
        telephone: '',
        roleId: 2, // PISCICULTEUR
        region_id: undefined,
        department_id: undefined,
      };
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<{ id: number; nom: string; regions: any[] }[]>([]);
  const [regions, setRegions] = useState<{ id: number; nom: string }[]>([]);

  // Mettre à jour le formulaire quand le mode ou le pisciculteur change
  useEffect(() => {
    if (mode === 'edit' && fishFarmer) {
      console.log('Mise à jour formulaire édition avec:', fishFarmer);
      setForm({
        username: fishFarmer.username || '',
        email: fishFarmer.email || '',
        password: '', // Pas de mot de passe en édition
        prenom: fishFarmer.prenom || '',
        nom: fishFarmer.nom || '',
        telephone: fishFarmer.telephone || '',
        roleId: fishFarmer.roleId || 2,
        region_id: fishFarmer.region?.id || undefined,
        department_id: fishFarmer.region?.departement?.id || undefined,
      });
    }
  }, [mode, fishFarmer]);

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);
  
  useEffect(() => {
    if (form.department_id) {
      const selectedDepartment = departments.find(d => d.id === form.department_id);
      if (selectedDepartment) {
        setRegions(selectedDepartment.regions);
      } else {
        setRegions([]);
      }
    } else {
      setRegions([]);
      setForm(prev => ({ ...prev, region_id: undefined }));
    }
  }, [form.department_id, departments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: value === '' ? undefined : 
        (name === 'region_id' || name === 'department_id') ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called, mode:', mode);
    console.log('Données du formulaire à envoyer:', form);
    setLoading(true);
    try {
      if (mode === 'create') {
        console.log('Appel createNewFishFarmer');
        await createNewFishFarmer(form);
        toast.success('Pisciculteur créé');
      } else if (mode === 'edit' && fishFarmer) {
        console.log('Appel updateFishFarmerData avec ID:', fishFarmer.id);
        // En mode édition, on envoie seulement les champs modifiés
        const updateData: Partial<INewFishFarmer> = {};
        if (form.nom !== fishFarmer.nom) updateData.nom = form.nom;
        if (form.prenom !== fishFarmer.prenom) updateData.prenom = form.prenom;
        if (form.telephone !== fishFarmer.telephone) updateData.telephone = form.telephone;
        if (form.email !== fishFarmer.email) updateData.email = form.email;
        if (form.region_id !== fishFarmer.region?.id) updateData.region_id = form.region_id;
        if (form.department_id !== fishFarmer.region?.departement?.id) updateData.department_id = form.department_id;
        
        console.log('Données de mise à jour (seulement les champs modifiés):', updateData);
        await updateFishFarmerData(fishFarmer.id, updateData);
        toast.success('Pisciculteur modifié');
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde pisciculteur:', err);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          {mode === 'create' ? 'Ajouter un pisciculteur' : mode === 'edit' ? 'Modifier le pisciculteur' : 'Détails du pisciculteur'}
        </ModalHeader>
        <ModalBody>
          {mode === 'view' ? (
            <div className="space-y-2">
              <div><b>ID :</b> {fishFarmer?.id}</div>
              <div><b>Nom :</b> {fishFarmer?.nom}</div>
              <div><b>Prénom :</b> {fishFarmer?.prenom}</div>
              <div><b>Téléphone :</b> {fishFarmer?.telephone}</div>
              <div><b>Email :</b> {fishFarmer?.email}</div>
              <div><b>Statut :</b> {fishFarmer?.status}</div>
              <div><b>Compte actif :</b> {fishFarmer?.compte_actif ? 'Oui' : 'Non'}</div>
              <div><b>Éligible SOA :</b> {fishFarmer?.eligible_soa ? 'Oui' : 'Non'}</div>
              <div><b>Score d'éligibilité :</b> 
                <Chip 
                  color={fishFarmer && calculateEligibilityScore(fishFarmer) >= 70 ? "success" : fishFarmer && calculateEligibilityScore(fishFarmer) >= 50 ? "warning" : "danger"} 
                  variant="flat" 
                  size="sm"
                  className="ml-2"
                >
                  {fishFarmer ? calculateEligibilityScore(fishFarmer) : 0}%
                </Chip>
              </div>
              <div><b>Région :</b> {fishFarmer?.region?.nom || '-'}</div>
              <div><b>Département :</b> {fishFarmer?.region?.departement?.nom || '-'}</div>
              <div><b>Date de création :</b> {new Date(fishFarmer?.createdAt || '').toLocaleDateString()}</div>
              <div><b>Dernière connexion :</b> {fishFarmer?.derniereConnexion ? new Date(fishFarmer.derniereConnexion).toLocaleDateString() : 'Jamais'}</div>
            </div>
          ) : (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} required className="w-full" />
                <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} required className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} required pattern="^\+?\d{8,15}$" errorMessage="Numéro invalide" className="w-full" />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" errorMessage="Email invalide" className="w-full" />
              </div>
              {mode === 'create' && <Input label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} required className="w-full" />}
              <div className="grid grid-cols-2 gap-4">
                <select name="department_id" value={form.department_id || ''} onChange={handleChange} required className="w-full border rounded p-2">
                  <option value="">Sélectionnez un département</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
                </select>
                <select name="region_id" value={form.region_id || ''} onChange={handleChange} required className="w-full border rounded p-2" disabled={!form.department_id}>
                  <option value="">Sélectionnez une région</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
            </form>
          )}
        </ModalBody>
        {mode !== 'view' && (
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
              {mode === 'create' ? 'Créer' : 'Enregistrer'}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

// Modal pour afficher les bassins d'un pisciculteur
const BasinsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  fishFarmer: IFishFarmer;
  onUnassignBasin: (basinId: number, fishFarmerId: number) => Promise<void>;
}> = ({ isOpen, onClose, fishFarmer, onUnassignBasin }) => {
  const { fishFarmerBasins, loading } = useFishFarmerStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          Bassins de {fishFarmer.prenom} {fishFarmer.nom}
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : fishFarmerBasins.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {fishFarmerBasins.map((basin: any) => (
                  <div key={basin.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{basin.nom || `Bassin #${basin.id}`}</h4>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => onUnassignBasin(basin.id, fishFarmer.id)}
                      >
                        Désassigner
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p>{basin.type || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Capacité:</span>
                        <p>{basin.capacite ? `${basin.capacite} m³` : 'Non spécifiée'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Statut:</span>
                        <p>{basin.statut || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Région:</span>
                        <p>{basin.region?.nom || 'Non spécifiée'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun bassin assigné à ce pisciculteur
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FishFarmerList; 