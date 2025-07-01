import { create } from 'zustand';
import { 
  IBassin, 
  ICreateBassin, 
  IUpdateBassin, 
  IAssignBassin,
  IPerformance,
  ICreatePerformance,
  IPecheControle,
  ICreatePecheControle,
  IBassinStats,
  IPerformanceStats,
  IPecheControleStats
} from '../components/types/waterBasin';
import { 
  getBassins, 
  createBassin, 
  updateBassin, 
  deleteBassin,
  assignBassin,
  unassignBassin,
  getBassinsByPisciculteur,
  getBassinsSansPisciculteur,
  getBassinsByStatus,
  getBassinsByRegion,
  getBassinsStats,
  createPerformance,
  getPerformances,
  getPerformanceStats,
  createPecheControle,
  getPechesControle,
  getPecheControleStats
} from '../api/services/admin/waterBasinService';
import { toast } from 'react-hot-toast';

interface WaterBasinStore {
  // État principal
  bassins: IBassin[];
  selectedBassin: IBassin | null;
  isLoading: boolean;
  error: string | null;
  
  // Statistiques
  stats: IBassinStats | null;
  
  // Performances
  performances: IPerformance[];
  performanceStats: IPerformanceStats | null;
  
  // Pêches de contrôle
  pechesControle: IPecheControle[];
  pecheControleStats: IPecheControleStats | null;
  
  // Actions principales
  fetchBassins: () => Promise<void>;
  fetchBassin: (id: number) => Promise<void>;
  createBassin: (data: ICreateBassin) => Promise<void>;
  updateBassin: (id: number, data: IUpdateBassin) => Promise<void>;
  deleteBassin: (id: number) => Promise<void>;
  
  // Actions d'assignation
  assignBassin: (data: IAssignBassin) => Promise<void>;
  unassignBassin: (bassinId: number, pisciculteurId: number) => Promise<void>;
  
  // Actions spécialisées
  fetchBassinsByPisciculteur: (pisciculteurId: number) => Promise<void>;
  fetchBassinsSansPisciculteur: () => Promise<void>;
  fetchBassinsByStatus: (status: string) => Promise<void>;
  fetchBassinsByRegion: (regionId: number) => Promise<void>;
  fetchBassinsStats: () => Promise<void>;
  
  // Actions performances
  createPerformance: (bassinId: number, data: ICreatePerformance) => Promise<void>;
  fetchPerformances: (bassinId: number) => Promise<void>;
  fetchPerformanceStats: (bassinId: number) => Promise<void>;
  
  // Actions pêches de contrôle
  createPecheControle: (bassinId: number, data: ICreatePecheControle) => Promise<void>;
  fetchPechesControle: (bassinId: number) => Promise<void>;
  fetchPecheControleStats: (bassinId: number) => Promise<void>;
  
  // Utilitaires
  setSelectedBassin: (bassin: IBassin | null) => void;
  clearError: () => void;
}

export const useWaterBasinStore = create<WaterBasinStore>((set, get) => ({
  // État initial
  bassins: [],
  selectedBassin: null,
  isLoading: false,
  error: null,
  stats: null,
  performances: [],
  performanceStats: null,
  pechesControle: [],
  pecheControleStats: null,

  // Actions principales
  fetchBassins: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Récupération des bassins depuis l\'API...');
      const bassins = await getBassins();
      console.log('Bassins récupérés:', bassins);
      console.log('Nombre de bassins:', bassins.length);
      set({ bassins, isLoading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des bassins:', error);
      set({ error: 'Erreur lors du chargement des bassins', isLoading: false });
      toast.error('Erreur lors du chargement des bassins');
    }
  },

  fetchBassin: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const bassin = await getBassins().then(bassins => bassins.find(b => b.id === id));
      if (bassin) {
        set({ selectedBassin: bassin, isLoading: false });
      } else {
        throw new Error('Bassin non trouvé');
      }
    } catch (error) {
      set({ error: 'Erreur lors du chargement du bassin', isLoading: false });
      toast.error('Erreur lors du chargement du bassin');
    }
  },

  createBassin: async (data: ICreateBassin) => {
    set({ isLoading: true, error: null });
    try {
      await createBassin(data);
      const bassins = await getBassins();
      set({ bassins, isLoading: false });
      toast.success('Bassin créé avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la création du bassin', isLoading: false });
      toast.error('Erreur lors de la création du bassin');
    }
  },

  updateBassin: async (id: number, data: IUpdateBassin) => {
    set({ isLoading: true, error: null });
    try {
      await updateBassin(id, data);
      const bassins = await getBassins();
      set({ bassins, isLoading: false });
      toast.success('Bassin modifié avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la modification du bassin', isLoading: false });
      toast.error('Erreur lors de la modification du bassin');
    }
  },

  deleteBassin: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteBassin(id);
      const bassins = await getBassins();
      set({ bassins, isLoading: false });
      toast.success('Bassin supprimé avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la suppression du bassin', isLoading: false });
      toast.error('Erreur lors de la suppression du bassin');
    }
  },

  // Actions d'assignation
  assignBassin: async (data: IAssignBassin) => {
    set({ isLoading: true, error: null });
    try {
      await assignBassin(data);
      const bassins = await getBassins();
      set({ bassins, isLoading: false });
      toast.success('Bassin assigné avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de l\'assignation du bassin', isLoading: false });
      toast.error('Erreur lors de l\'assignation du bassin');
    }
  },

  unassignBassin: async (bassinId: number, pisciculteurId: number) => {
    set({ isLoading: true, error: null });
    try {
      await unassignBassin(bassinId, pisciculteurId);
      const bassins = await getBassins();
      set({ bassins, isLoading: false });
      toast.success('Bassin désassigné avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la désassignation du bassin', isLoading: false });
      toast.error('Erreur lors de la désassignation du bassin');
    }
  },

  // Actions spécialisées
  fetchBassinsByPisciculteur: async (pisciculteurId: number) => {
    set({ isLoading: true, error: null });
    try {
      const bassins = await getBassinsByPisciculteur(pisciculteurId);
      set({ bassins, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des bassins du pisciculteur', isLoading: false });
      toast.error('Erreur lors du chargement des bassins du pisciculteur');
    }
  },

  fetchBassinsSansPisciculteur: async () => {
    set({ isLoading: true, error: null });
    try {
      const bassins = await getBassinsSansPisciculteur();
      set({ bassins, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des bassins non assignés', isLoading: false });
      toast.error('Erreur lors du chargement des bassins non assignés');
    }
  },

  fetchBassinsByStatus: async (status: string) => {
    set({ isLoading: true, error: null });
    try {
      const bassins = await getBassinsByStatus(status);
      set({ bassins, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des bassins par statut', isLoading: false });
      toast.error('Erreur lors du chargement des bassins par statut');
    }
  },

  fetchBassinsByRegion: async (regionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const bassins = await getBassinsByRegion(regionId);
      set({ bassins, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des bassins par région', isLoading: false });
      toast.error('Erreur lors du chargement des bassins par région');
    }
  },

  fetchBassinsStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await getBassinsStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des statistiques', isLoading: false });
      toast.error('Erreur lors du chargement des statistiques');
    }
  },

  // Actions performances
  createPerformance: async (bassinId: number, data: ICreatePerformance) => {
    set({ isLoading: true, error: null });
    try {
      await createPerformance(bassinId, data);
      const performances = await getPerformances(bassinId);
      set({ performances, isLoading: false });
      toast.success('Performance créée avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la création de la performance', isLoading: false });
      toast.error('Erreur lors de la création de la performance');
    }
  },

  fetchPerformances: async (bassinId: number) => {
    set({ isLoading: true, error: null });
    try {
      const performances = await getPerformances(bassinId);
      set({ performances, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des performances', isLoading: false });
      toast.error('Erreur lors du chargement des performances');
    }
  },

  fetchPerformanceStats: async (bassinId: number) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await getPerformanceStats(bassinId);
      set({ performanceStats: stats, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des statistiques de performance', isLoading: false });
      toast.error('Erreur lors du chargement des statistiques de performance');
    }
  },

  // Actions pêches de contrôle
  createPecheControle: async (bassinId: number, data: ICreatePecheControle) => {
    set({ isLoading: true, error: null });
    try {
      await createPecheControle(bassinId, data);
      const peches = await getPechesControle(bassinId);
      set({ pechesControle: peches, isLoading: false });
      toast.success('Pêche de contrôle créée avec succès');
    } catch (error) {
      set({ error: 'Erreur lors de la création de la pêche de contrôle', isLoading: false });
      toast.error('Erreur lors de la création de la pêche de contrôle');
    }
  },

  fetchPechesControle: async (bassinId: number) => {
    set({ isLoading: true, error: null });
    try {
      const peches = await getPechesControle(bassinId);
      set({ pechesControle: peches, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des pêches de contrôle', isLoading: false });
      toast.error('Erreur lors du chargement des pêches de contrôle');
    }
  },

  fetchPecheControleStats: async (bassinId: number) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await getPecheControleStats(bassinId);
      set({ pecheControleStats: stats, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des statistiques de pêche de contrôle', isLoading: false });
      toast.error('Erreur lors du chargement des statistiques de pêche de contrôle');
    }
  },

  // Utilitaires
  setSelectedBassin: (bassin: IBassin | null) => {
    set({ selectedBassin: bassin });
  },

  clearError: () => {
    set({ error: null });
  },
})); 