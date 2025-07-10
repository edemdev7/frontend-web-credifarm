import { IResponse } from "../../components/types/global";
import { IFishFarmer, INewFishFarmer, IUpdateFishFarmerStatus, IFishFarmerFilters } from "../../components/types/fishFarmer";
import axiosInstance from "../axiosInstance";

// Données mockées pour les pisciculteurs
const mockFishFarmers: IFishFarmer[] = [
  {
    id: 1,
    username: "pisciculteur1",
    email: "pisciculteur1@example.com",
    password: "password123",
    prenom: "Jean",
    nom: "Dupont",
    telephone: "123456789",
    status: "actif",
    compte_actif: true,
    eligible_soa: true,
    date_activation: "2024-01-15T10:00:00Z",
    admin_activation: "admin@example.com",
    raison_desactivation: null,
    otp_code: null,
    otp_expire_at: null,
    derniereConnexion: "2024-01-20T14:30:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    roleId: 2,
    role: {
      id: 2,
      nom: "Pisciculteur",
      description: "Gestion des bassins et opérations courantes",
      code: "PISCICULTEUR",
      niveau: 10,
      est_actif: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    region: {
      id: 1,
      nom: "Région Centre",
      departement: {
        id: 1,
        nom: "Département Central"
      }
    },
    eligibility_status: 'GO',
    eligibility_reason: ''
  },
  {
    id: 2,
    username: "pisciculteur2",
    email: "pisciculteur2@example.com",
    password: "password456",
    prenom: "Marie",
    nom: "Martin",
    telephone: "987654321",
    status: "actif",
    compte_actif: false,
    eligible_soa: false,
    date_activation: null,
    admin_activation: null,
    raison_desactivation: "En attente de validation",
    otp_code: null,
    otp_expire_at: null,
    derniereConnexion: null,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
    roleId: 2,
    role: {
      id: 2,
      nom: "Pisciculteur",
      description: "Gestion des bassins et opérations courantes",
      code: "PISCICULTEUR",
      niveau: 10,
      est_actif: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    region: {
      id: 2,
      nom: "Région Nord",
      departement: {
        id: 2,
        nom: "Département Nord"
      }
    },
    eligibility_status: 'NON_GO',
    eligibility_reason: 'Documents manquants'
  },
  {
    id: 3,
    username: "pisciculteur3",
    email: "pisciculteur3@example.com",
    password: "password789",
    prenom: "Ali",
    nom: "Traoré",
    telephone: "555123456",
    status: "inactif",
    compte_actif: false,
    eligible_soa: false,
    date_activation: null,
    admin_activation: null,
    raison_desactivation: "Non respect des critères",
    otp_code: null,
    otp_expire_at: null,
    derniereConnexion: null,
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-18T08:00:00Z",
    roleId: 2,
    role: {
      id: 2,
      nom: "Pisciculteur",
      description: "Gestion des bassins et opérations courantes",
      code: "PISCICULTEUR",
      niveau: 10,
      est_actif: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    region: {
      id: 3,
      nom: "Région Sud",
      departement: {
        id: 3,
        nom: "Département Sud"
      }
    },
    eligibility_status: 'NON_GO_CONDITIONNE',
    eligibility_reason: 'Doit fournir un justificatif de formation'
  }
];

// Récupérer tous les pisciculteurs depuis l'API
export const getAllFishFarmers = async (): Promise<IResponse<IFishFarmer[]>> => {
  try {
    console.log('Appel API getAllFishFarmers - endpoint réel');
    const response = await axiosInstance.get<IResponse<IFishFarmer[]>>('/users/pisciculteurs/all');
    console.log('Réponse API getAllFishFarmers:', response.data);
    
    // L'API retourne directement le tableau, pas un objet avec data
    const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
    console.log('Données extraites:', data);
    
    return {
      success: true,
      status: 200,
      data: data,
      message: "Liste des pisciculteurs récupérée"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des pisciculteurs:', error);
    return {
      success: false,
      status: 500,
      data: [],
      message: "Erreur lors de la récupération des pisciculteurs"
    };
  }
};

// Récupérer les pisciculteurs actifs pour l'assignation
export const getActiveFishFarmers = async (): Promise<IFishFarmer[]> => {
  try {
    console.log('Appel API getActiveFishFarmers...');
    const response = await axiosInstance.get('/users/pisciculteurs/status/actif');
    console.log('Réponse API getActiveFishFarmers:', response.data);
    
    // L'API retourne directement un tableau
    const pisciculteurs = Array.isArray(response.data) ? response.data : [];
    
    // Filtrer seulement les pisciculteurs avec status "actif" (moins restrictif)
    const activeFishFarmers = pisciculteurs.filter((pisciculteur: any) => 
      pisciculteur.status === "actif"
    );
    
    console.log('Pisciculteurs filtrés (status actif):', activeFishFarmers);
    return activeFishFarmers;
  } catch (error) {
    console.error('Erreur lors de la récupération des pisciculteurs actifs:', error);
    return [];
  }
};

// Récupérer les pisciculteurs par statut
export const getFishFarmersByStatus = async (status: 'actif' | 'inactif'): Promise<IResponse<IFishFarmer[]>> => {
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const fishFarmers = mockFishFarmers.filter(farmer => 
      farmer.role.code === 'PISCICULTEUR' && farmer.status === status
    );
    
    return {
      success: true,
      status: 200,
      data: fishFarmers,
      message: `Pisciculteurs ${status} récupérés`
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: [],
      message: "Erreur lors de la récupération des pisciculteurs par statut"
    };
  }
};

// Créer un nouveau pisciculteur
export const createFishFarmer = async (fishFarmerData: INewFishFarmer): Promise<IResponse<IFishFarmer>> => {
  try {
    console.log('Appel API createFishFarmer:', fishFarmerData);
    
    // Adapter les données pour l'API
    const apiData = {
      username: fishFarmerData.username,
      email: fishFarmerData.email,
      password: fishFarmerData.password,
      nom: fishFarmerData.nom,
      prenom: fishFarmerData.prenom,
      role: "PISCICULTEUR",
      telephone: fishFarmerData.telephone
    };
    
    console.log('Données envoyées à l\'API:', apiData);
    const response = await axiosInstance.post<IResponse<IFishFarmer>>('/users', apiData);
    console.log('Réponse API createFishFarmer:', response.data);
    
    const data = response.data.data || response.data;
    
    return {
      success: true,
      status: 201,
      data: data as IFishFarmer,
      message: "Pisciculteur créé avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la création du pisciculteur:', error);
    return {
      success: false,
      status: 500,
      data: undefined,
      message: "Erreur lors de la création du pisciculteur"
    };
  }
};

// Mettre à jour un pisciculteur
export const updateFishFarmer = async (
  id: number, 
  fishFarmerData: Partial<INewFishFarmer>
): Promise<IResponse<IFishFarmer>> => {
  try {
    console.log('Appel API updateFishFarmer - ID:', id);
    console.log('Données reçues pour mise à jour:', fishFarmerData);
    
    // Adapter les données pour l'API
    const apiData: any = {};
    if (fishFarmerData.nom) apiData.nom = fishFarmerData.nom;
    if (fishFarmerData.prenom) apiData.prenom = fishFarmerData.prenom;
    if (fishFarmerData.email) apiData.email = fishFarmerData.email;
    if (fishFarmerData.password) apiData.password = fishFarmerData.password;
    if (fishFarmerData.telephone) apiData.telephone = fishFarmerData.telephone;
    if (fishFarmerData.roleId) {
      apiData.role = {
        code: "PISCICULTEUR"
      };
    }
    
    console.log('Données envoyées à l\'API (PATCH):', apiData);
    console.log('Endpoint: PATCH /users/' + id);
    
    const response = await axiosInstance.patch<IResponse<IFishFarmer>>(`/users/${id}`, apiData);
    console.log('Réponse API updateFishFarmer:', response.data);
    
    const data = response.data.data || response.data;
    console.log('Données retournées après mise à jour:', data);
    
    return {
      success: true,
      status: 200,
      data: data as IFishFarmer,
      message: "Pisciculteur mis à jour avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pisciculteur:', error);
    return {
      success: false,
      status: 500,
      data: undefined,
      message: "Erreur lors de la mise à jour du pisciculteur"
    };
  }
};

// Supprimer un pisciculteur
export const deleteFishFarmer = async (id: number): Promise<IResponse<boolean>> => {
  try {
    console.log('Appel API deleteFishFarmer:', id);
    const response = await axiosInstance.delete<IResponse<boolean>>(`/users/${id}`);
    console.log('Réponse API deleteFishFarmer:', response.data);
    
    return {
      success: true,
      status: 200,
      data: true,
      message: "Pisciculteur supprimé avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du pisciculteur:', error);
    return {
      success: false,
      status: 500,
      data: false,
      message: "Erreur lors de la suppression du pisciculteur"
    };
  }
};

// Mettre à jour le statut et l'éligibilité d'un pisciculteur
export const updateFishFarmerStatus = async (
  id: number, 
  statusData: IUpdateFishFarmerStatus
): Promise<IResponse<IFishFarmer>> => {
  try {
    console.log('Appel API updateFishFarmerStatus:', { id, statusData });
    
    // Utiliser le bon endpoint pour la gestion du statut
    const apiData = {
      compte_actif: statusData.compte_actif,
      eligible_soa: statusData.eligible_soa,
      raison_desactivation: statusData.raison_desactivation || ""
    };
    
    console.log('Données envoyées à l\'API:', apiData);
    const response = await axiosInstance.patch<IResponse<IFishFarmer>>(`/users/pisciculteurs/${id}/status`, apiData);
    console.log('Réponse API updateFishFarmerStatus:', response.data);
    
    const data = response.data.data || response.data;
    
    return {
      success: true,
      status: 200,
      data: data as IFishFarmer,
      message: "Statut du pisciculteur mis à jour avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return {
      success: false,
      status: 500,
      data: undefined,
      message: "Erreur lors de la mise à jour du statut"
    };
  }
};

// Désassigner un bassin d'un pisciculteur
export const unassignBasinFromFishFarmer = async (
  basinId: number, 
  fishFarmerId: number
): Promise<IResponse<boolean>> => {
  try {
    console.log('Appel API unassignBasinFromFishFarmer:', { basinId, fishFarmerId });
    
    const response = await axiosInstance.post<IResponse<boolean>>(`/bassins/${basinId}/unassign/${fishFarmerId}`);
    console.log('Réponse API unassignBasinFromFishFarmer:', response.data);
    
    return {
      success: true,
      status: 200,
      data: true,
      message: "Bassin désassigné avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la désassignation du bassin:', error);
    return {
      success: false,
      status: 500,
      data: false,
      message: "Erreur lors de la désassignation du bassin"
    };
  }
};

// Récupérer les bassins d'un pisciculteur
export const getFishFarmerBasins = async (fishFarmerId: number): Promise<IResponse<any[]>> => {
  try {
    console.log('Appel API getFishFarmerBasins:', fishFarmerId);
    
    const response = await axiosInstance.get<IResponse<any[]>>(`/bassins/pisciculteur/${fishFarmerId}`);
    console.log('Réponse API getFishFarmerBasins:', response.data);
    
    const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
    
    return {
      success: true,
      status: 200,
      data: data,
      message: "Liste des bassins récupérée avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des bassins:', error);
    return {
      success: false,
      status: 500,
      data: [],
      message: "Erreur lors de la récupération des bassins"
    };
  }
};

// Récupérer un pisciculteur par ID
export const getFishFarmerById = async (id: number): Promise<IResponse<IFishFarmer>> => {
  try {
    console.log('Appel API getFishFarmerById:', id);
    const response = await axiosInstance.get<IResponse<IFishFarmer>>(`/users/${id}`);
    console.log('Réponse API getFishFarmerById:', response.data);
    
    const data = response.data.data || response.data;
    
    return {
      success: true,
      status: 200,
      data: data as IFishFarmer,
      message: "Pisciculteur récupéré avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du pisciculteur:', error);
    return {
      success: false,
      status: 500,
      data: undefined,
      message: "Erreur lors de la récupération du pisciculteur"
    };
  }
}; 