import { create } from 'zustand';
import { IFishSpecies, ICreateFishSpecies, IUpdateFishSpecies, IFishFood, ICreateFishFood, IUpdateFishFood } from '../components/types/fish';
import { fishSpeciesService, fishFoodService } from '../api/services/fishService';

// Store pour les espèces de poissons
interface FishSpeciesStore {
  species: IFishSpecies[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSpecies: () => Promise<void>;
  createSpecies: (data: ICreateFishSpecies) => Promise<void>;
  updateSpecies: (id: number, data: IUpdateFishSpecies) => Promise<void>;
  deleteSpecies: (id: number) => Promise<void>;
  toggleSpeciesStatus: (id: number) => Promise<void>;
  getSpeciesById: (id: number) => IFishSpecies | undefined;
  clearError: () => void;
}

export const useFishSpeciesStore = create<FishSpeciesStore>((set, get) => ({
  species: [],
  isLoading: false,
  error: null,

  fetchSpecies: async () => {
    set({ isLoading: true, error: null });
    try {
      const species = await fishSpeciesService.getAllFishSpecies();
      set({ species, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des espèces', 
        isLoading: false 
      });
    }
  },

  createSpecies: async (data: ICreateFishSpecies) => {
    set({ isLoading: true, error: null });
    try {
      const newSpecies = await fishSpeciesService.createFishSpecies(data);
      set(state => ({
        species: [...state.species, newSpecies],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'espèce', 
        isLoading: false 
      });
    }
  },

  updateSpecies: async (id: number, data: IUpdateFishSpecies) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSpecies = await fishSpeciesService.updateFishSpecies(id, data);
      set(state => ({
        species: state.species.map(s => s.id === id ? updatedSpecies : s),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la modification de l\'espèce', 
        isLoading: false 
      });
    }
  },

  deleteSpecies: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await fishSpeciesService.deleteFishSpecies(id);
      set(state => ({
        species: state.species.filter(s => s.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'espèce', 
        isLoading: false 
      });
    }
  },

  toggleSpeciesStatus: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSpecies = await fishSpeciesService.toggleFishSpeciesStatus(id);
      set(state => ({
        species: state.species.map(s => s.id === id ? updatedSpecies : s),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du changement de statut', 
        isLoading: false 
      });
    }
  },

  getSpeciesById: (id: number) => {
    return get().species.find(s => s.id === id);
  },

  clearError: () => set({ error: null })
}));

// Store pour les aliments pour poissons
interface FishFoodStore {
  foods: IFishFood[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFoods: () => Promise<void>;
  createFood: (data: ICreateFishFood) => Promise<void>;
  updateFood: (id: number, data: IUpdateFishFood) => Promise<void>;
  deleteFood: (id: number) => Promise<void>;
  updateFoodStatus: (id: number, statut: 'ACTIF' | 'INACTIF' | 'RUPTURE') => Promise<void>;
  updateFoodStock: (id: number, newStock: number) => Promise<void>;
  getFoodById: (id: number) => IFishFood | undefined;
  getFoodsByType: (type: string) => IFishFood[];
  getFoodsByLifeStage: (stade: string) => IFishFood[];
  getFoodsBySpecies: (speciesId: number) => IFishFood[];
  clearError: () => void;
}

export const useFishFoodStore = create<FishFoodStore>((set, get) => ({
  foods: [],
  isLoading: false,
  error: null,

  fetchFoods: async () => {
    set({ isLoading: true, error: null });
    try {
      const foods = await fishFoodService.getAllFishFood();
      set({ foods, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des aliments', 
        isLoading: false 
      });
    }
  },

  createFood: async (data: ICreateFishFood) => {
    set({ isLoading: true, error: null });
    try {
      const newFood = await fishFoodService.createFishFood(data);
      set(state => ({
        foods: [...state.foods, newFood],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'aliment', 
        isLoading: false 
      });
    }
  },

  updateFood: async (id: number, data: IUpdateFishFood) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFood = await fishFoodService.updateFishFood(id, data);
      set(state => ({
        foods: state.foods.map(f => f.id === id ? updatedFood : f),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la modification de l\'aliment', 
        isLoading: false 
      });
    }
  },

  deleteFood: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await fishFoodService.deleteFishFood(id);
      set(state => ({
        foods: state.foods.filter(f => f.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'aliment', 
        isLoading: false 
      });
    }
  },

  updateFoodStatus: async (id: number, statut: 'ACTIF' | 'INACTIF' | 'RUPTURE') => {
    set({ isLoading: true, error: null });
    try {
      const updatedFood = await fishFoodService.updateFishFoodStatus(id, statut);
      set(state => ({
        foods: state.foods.map(f => f.id === id ? updatedFood : f),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du changement de statut', 
        isLoading: false 
      });
    }
  },

  updateFoodStock: async (id: number, newStock: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFood = await fishFoodService.updateFishFoodStock(id, newStock);
      set(state => ({
        foods: state.foods.map(f => f.id === id ? updatedFood : f),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du stock', 
        isLoading: false 
      });
    }
  },

  getFoodById: (id: number) => {
    return get().foods.find(f => f.id === id);
  },

  getFoodsByType: (type: string) => {
    return get().foods.filter(f => f.type === type);
  },

  getFoodsByLifeStage: (stade: string) => {
    return get().foods.filter(f => f.stade_vie === stade);
  },

  getFoodsBySpecies: (speciesId: number) => {
    return get().foods.filter(f => f.especes_compatibles.includes(speciesId));
  },

  clearError: () => set({ error: null })
})); 