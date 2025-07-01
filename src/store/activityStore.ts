import { create } from "zustand";
import { IActivity, IActivityStats, IActivityResponse, IActivityFilters } from "../components/types/activity";
import {
  getFishFarmerActivities,
  getFishFarmerActivityStats
} from "../api/services/activityService";

interface ActivityStore {
  activities: IActivity[];
  activityStats: IActivityStats[];
  currentResponse: IActivityResponse | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setActivities: (activities: IActivity[]) => void;
  setActivityStats: (stats: IActivityStats[]) => void;
  setCurrentResponse: (response: IActivityResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchFishFarmerActivities: (pisciculteurId: number, filters?: IActivityFilters) => Promise<void>;
  fetchFishFarmerActivityStats: (pisciculteurId: number) => Promise<void>;
  
  // Clear actions
  clearActivities: () => void;
  clearActivityStats: () => void;
  clearCurrentResponse: () => void;
  clearError: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  activityStats: [],
  currentResponse: null,
  loading: false,
  error: null,

  // Setters
  setActivities: (activities) => set({ activities }),
  setActivityStats: (stats) => set({ activityStats: stats }),
  setCurrentResponse: (response) => set({ currentResponse: response }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // API calls
  fetchFishFarmerActivities: async (pisciculteurId, filters) => {
    set({ loading: true, error: null });
    try {
      const response = await getFishFarmerActivities(pisciculteurId, filters);
      if (response.success) {
        set({ 
          activities: response.data.activites, 
          currentResponse: response.data,
          loading: false 
        });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des activités", loading: false });
    }
  },

  fetchFishFarmerActivityStats: async (pisciculteurId) => {
    set({ loading: true, error: null });
    try {
      const response = await getFishFarmerActivityStats(pisciculteurId);
      if (response.success) {
        set({ activityStats: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des statistiques", loading: false });
    }
  },

  // Clear actions
  clearActivities: () => set({ activities: [] }),
  clearActivityStats: () => set({ activityStats: [] }),
  clearCurrentResponse: () => set({ currentResponse: null }),
  clearError: () => set({ error: null }),
})); 