import { IResponse } from "../../components/types/global";
import { IActivity, IActivityStats, IActivityResponse, IActivityFilters, ActivityType } from "../../components/types/activity";
import axiosInstance from "../axiosInstance";

// Mock data pour les activités
const mockActivities: IActivity[] = [
  {
    id: 1,
    type: "connexion",
    description: "Connexion à la plateforme de gestion piscicole",
    donnees: {
      session_duration: 112,
      pages_visited: 8
    },
    ip_address: "192.168.1.86",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    date_activite: "2025-06-29T10:26:01.525Z",
    pisciculteurId: 7,
    pisciculteur: {
      id: 7,
      username: "ekpomachi@gmail.com",
      email: "ekpomachi@gmail.com",
      nom: "KPOMACHI",
      prenom: "Edeme",
      telephone: "68548443",
      status: "actif"
    }
  },
  {
    id: 2,
    type: "creation_bassin",
    description: "Création du bassin principal de production",
    donnees: {
      nom_bassin: "Bassin Principal",
      superficie: 500,
      profondeur: 1.5,
      type_poisson: "Tilapia"
    },
    date_activite: "2025-06-04T05:29:01.525Z",
    pisciculteurId: 7,
    pisciculteur: {
      id: 7,
      username: "ekpomachi@gmail.com",
      email: "ekpomachi@gmail.com",
      nom: "KPOMACHI",
      prenom: "Edeme",
      telephone: "68548443",
      status: "actif"
    }
  },
  {
    id: 3,
    type: "ajout_poisson",
    description: "Ajout de 1000 alevins de Tilapia",
    donnees: {
      quantite: 1000,
      type_poisson: "Tilapia",
      bassin_id: 1
    },
    date_activite: "2025-06-05T08:15:00.000Z",
    pisciculteurId: 7,
    pisciculteur: {
      id: 7,
      username: "ekpomachi@gmail.com",
      email: "ekpomachi@gmail.com",
      nom: "KPOMACHI",
      prenom: "Edeme",
      telephone: "68548443",
      status: "actif"
    }
  },
  {
    id: 4,
    type: "distribution_aliment",
    description: "Distribution d'aliment pour les poissons",
    donnees: {
      quantite: 50,
      type_aliment: "Granulés",
      bassin_id: 1
    },
    date_activite: "2025-06-06T06:30:00.000Z",
    pisciculteurId: 7,
    pisciculteur: {
      id: 7,
      username: "ekpomachi@gmail.com",
      email: "ekpomachi@gmail.com",
      nom: "KPOMACHI",
      prenom: "Edeme",
      telephone: "68548443",
      status: "actif"
    }
  },
  {
    id: 5,
    type: "mesure_eau",
    description: "Mesure de la qualité de l'eau",
    donnees: {
      ph: 7.2,
      temperature: 26,
      oxygene: 6.5,
      bassin_id: 1
    },
    date_activite: "2025-06-07T07:00:00.000Z",
    pisciculteurId: 7,
    pisciculteur: {
      id: 7,
      username: "ekpomachi@gmail.com",
      email: "ekpomachi@gmail.com",
      nom: "KPOMACHI",
      prenom: "Edeme",
      telephone: "68548443",
      status: "actif"
    }
  },
  {
    id: 6,
    type: "connexion",
    description: "Connexion à la plateforme de gestion piscicole",
    donnees: {
      session_duration: 45,
      pages_visited: 3
    },
    ip_address: "192.168.1.86",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    date_activite: "2025-06-28T14:20:01.525Z",
    pisciculteurId: 8,
    pisciculteur: {
      id: 8,
      username: "john.doe@example.com",
      email: "john.doe@example.com",
      nom: "Doe",
      prenom: "John",
      telephone: "+237612345678",
      status: "inactif"
    }
  },
  {
    id: 7,
    type: "creation_bassin",
    description: "Création du bassin secondaire",
    donnees: {
      nom_bassin: "Bassin Secondaire",
      superficie: 300,
      profondeur: 1.2,
      type_poisson: "Carp"
    },
    date_activite: "2025-06-03T09:15:00.000Z",
    pisciculteurId: 8,
    pisciculteur: {
      id: 8,
      username: "john.doe@example.com",
      email: "john.doe@example.com",
      nom: "Doe",
      prenom: "John",
      telephone: "+237612345678",
      status: "inactif"
    }
  }
];

// Récupérer l'historique des activités d'un pisciculteur
export const getFishFarmerActivities = async (
  pisciculteurId: number, 
  filters?: IActivityFilters
): Promise<IResponse<IActivityResponse>> => {
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredActivities = mockActivities.filter(activity => activity.pisciculteurId === pisciculteurId);
    
    // Appliquer les filtres
    if (filters?.type) {
      filteredActivities = filteredActivities.filter(activity => activity.type === filters.type);
    }
    
    if (filters?.dateFrom) {
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.date_activite) >= new Date(filters.dateFrom!)
      );
    }
    
    if (filters?.dateTo) {
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.date_activite) <= new Date(filters.dateTo!)
      );
    }
    
    // Trier par date (plus récent en premier)
    filteredActivities.sort((a, b) => new Date(b.date_activite).getTime() - new Date(a.date_activite).getTime());
    
    const total = filteredActivities.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginatedActivities = filteredActivities.slice(start, end);
    
    return {
      success: true,
      status: 200,
      data: {
        activites: paginatedActivities,
        total
      },
      message: "Historique des activités récupéré"
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: { activites: [], total: 0 },
      message: "Erreur lors de la récupération de l'historique"
    };
  }
};

// Récupérer les statistiques d'activité d'un pisciculteur
export const getFishFarmerActivityStats = async (
  pisciculteurId: number
): Promise<IResponse<IActivityStats[]>> => {
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activities = mockActivities.filter(activity => activity.pisciculteurId === pisciculteurId);
    
    // Compter les activités par type
    const statsMap = new Map<ActivityType, number>();
    
    activities.forEach(activity => {
      const currentCount = statsMap.get(activity.type) || 0;
      statsMap.set(activity.type, currentCount + 1);
    });
    
    // Convertir en format de réponse
    const stats: IActivityStats[] = Array.from(statsMap.entries()).map(([type, count]) => ({
      type,
      count: count.toString()
    }));
    
    // Trier par nombre d'activités décroissant
    stats.sort((a, b) => parseInt(b.count) - parseInt(a.count));
    
    return {
      success: true,
      status: 200,
      data: stats,
      message: "Statistiques d'activité récupérées"
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: [],
      message: "Erreur lors de la récupération des statistiques"
    };
  }
};

// Créer une nouvelle activité (pour les tests)
export const createActivity = async (activityData: Omit<IActivity, 'id' | 'date_activite'>): Promise<IResponse<IActivity>> => {
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newActivity: IActivity = {
      id: Math.max(...mockActivities.map(a => a.id)) + 1,
      ...activityData,
      date_activite: new Date().toISOString()
    };
    
    mockActivities.push(newActivity);
    
    return {
      success: true,
      status: 201,
      data: newActivity,
      message: "Activité créée avec succès"
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: undefined,
      message: "Erreur lors de la création de l'activité"
    };
  }
}; 