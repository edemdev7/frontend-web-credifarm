import { create } from "zustand";
import { IFishFarmer, INewFishFarmer, IUpdateFishFarmerStatus } from "../components/types/fishFarmer";
import {
  getAllFishFarmers,
  getFishFarmersByStatus,
  updateFishFarmerStatus,
  createFishFarmer,
  updateFishFarmer,
  deleteFishFarmer,
  getFishFarmerById,
  unassignBasinFromFishFarmer,
  getFishFarmerBasins
} from "../api/services/fishFarmerService";

interface FishFarmerStore {
  fishFarmers: IFishFarmer[];
  selectedFishFarmer: IFishFarmer | null;
  fishFarmerBasins: any[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setFishFarmers: (fishFarmers: IFishFarmer[]) => void;
  setSelectedFishFarmer: (fishFarmer: IFishFarmer | null) => void;
  setFishFarmerBasins: (basins: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchAllFishFarmers: () => Promise<void>;
  fetchFishFarmersByStatus: (status: 'actif' | 'inactif') => Promise<void>;
  updateStatus: (id: number, statusData: IUpdateFishFarmerStatus) => Promise<void>;
  createNewFishFarmer: (fishFarmerData: INewFishFarmer) => Promise<void>;
  updateFishFarmerData: (id: number, fishFarmerData: Partial<INewFishFarmer>) => Promise<void>;
  deleteFishFarmerData: (id: number) => Promise<void>;
  fetchFishFarmerById: (id: number) => Promise<void>;
  unassignBasin: (basinId: number, fishFarmerId: number) => Promise<void>;
  fetchFishFarmerBasins: (fishFarmerId: number) => Promise<void>;
  
  // Clear actions
  clearFishFarmers: () => void;
  clearSelectedFishFarmer: () => void;
  clearFishFarmerBasins: () => void;
  clearError: () => void;
}

export const useFishFarmerStore = create<FishFarmerStore>((set, get) => ({
  fishFarmers: [],
  selectedFishFarmer: null,
  fishFarmerBasins: [],
  loading: false,
  error: null,

  // Setters
  setFishFarmers: (fishFarmers) => set({ fishFarmers }),
  setSelectedFishFarmer: (fishFarmer) => set({ selectedFishFarmer: fishFarmer }),
  setFishFarmerBasins: (basins) => set({ fishFarmerBasins: basins }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // API calls
  fetchAllFishFarmers: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Store: appel fetchAllFishFarmers');
      const response = await getAllFishFarmers();
      console.log('Store: réponse reçue:', response);
      if (response.success) {
        console.log('Store: données à stocker:', response.data);
        set({ fishFarmers: response.data, loading: false });
      } else {
        console.log('Store: erreur dans la réponse:', response.message);
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      console.error('Store: erreur lors de la récupération des pisciculteurs:', error);
      set({ error: "Erreur lors de la récupération des pisciculteurs", loading: false });
    }
  },

  fetchFishFarmersByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const response = await getFishFarmersByStatus(status);
      if (response.success) {
        set({ fishFarmers: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des pisciculteurs par statut", loading: false });
    }
  },

  updateStatus: async (id, statusData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateFishFarmerStatus(id, statusData);
      if (response.success) {
        // Mettre à jour la liste des pisciculteurs
        const { fishFarmers } = get();
        const updatedFishFarmers = fishFarmers.map(farmer => 
          farmer.id === id ? response.data! : farmer
        );
        set({ 
          fishFarmers: updatedFishFarmers, 
          selectedFishFarmer: response.data,
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour du statut", loading: false });
    }
  },

  createNewFishFarmer: async (fishFarmerData) => {
    set({ loading: true, error: null });
    try {
      const response = await createFishFarmer(fishFarmerData);
      if (response.success) {
        const { fishFarmers } = get();
        set({ 
          fishFarmers: [...fishFarmers, response.data!], 
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la création du pisciculteur", loading: false });
    }
  },

  updateFishFarmerData: async (id, fishFarmerData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateFishFarmer(id, fishFarmerData);
      if (response.success) {
        const { fishFarmers } = get();
        const updatedFishFarmers = fishFarmers.map(farmer => 
          farmer.id === id ? response.data! : farmer
        );
        set({ 
          fishFarmers: updatedFishFarmers, 
          selectedFishFarmer: response.data,
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour du pisciculteur", loading: false });
    }
  },

  deleteFishFarmerData: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteFishFarmer(id);
      if (response.success) {
        const { fishFarmers } = get();
        const updatedFishFarmers = fishFarmers.filter(farmer => farmer.id !== id);
        set({ 
          fishFarmers: updatedFishFarmers, 
          selectedFishFarmer: null,
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la suppression du pisciculteur", loading: false });
    }
  },

  fetchFishFarmerById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getFishFarmerById(id);
      if (response.success) {
        set({ selectedFishFarmer: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération du pisciculteur", loading: false });
    }
  },

  unassignBasin: async (basinId, fishFarmerId) => {
    set({ loading: true, error: null });
    try {
      const response = await unassignBasinFromFishFarmer(basinId, fishFarmerId);
      if (response.success) {
        const { fishFarmers } = get();
        const updatedFishFarmers = fishFarmers.map(farmer => 
          farmer.id === fishFarmerId ? response.data! : farmer
        );
        set({ 
          fishFarmers: updatedFishFarmers, 
          selectedFishFarmer: response.data,
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la suppression du bassin", loading: false });
    }
  },

  fetchFishFarmerBasins: async (fishFarmerId) => {
    set({ loading: true, error: null });
    try {
      const response = await getFishFarmerBasins(fishFarmerId);
      if (response.success) {
        set({ fishFarmerBasins: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des bassins", loading: false });
    }
  },

  // Clear actions
  clearFishFarmers: () => set({ fishFarmers: [] }),
  clearSelectedFishFarmer: () => set({ selectedFishFarmer: null }),
  clearFishFarmerBasins: () => set({ fishFarmerBasins: [] }),
  clearError: () => set({ error: null }),
})); 