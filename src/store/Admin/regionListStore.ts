import { create } from "zustand";
import { IRegion } from "../../components/types/region";
import {
    fetchRegions as apiFetchRegions,
    createRegion as apiCreateRegion,
    updateRegion as apiUpdateRegion,
    deleteRegion as apiDeleteRegion,
    getRegionById as apiGetRegionById,
    fetchRegionsByDepartment as apiFetchRegionsByDepartment
} from "../../api/regions";

interface RegionListStore {
    regions: IRegion[];
    selectedRegion: IRegion | null;
    setRegions: (regions: IRegion[]) => void;
    setSelectedRegion: (selectedRegion: IRegion | null) => void;
    clearRegions: () => void;
    clearSelectedRegion: () => void;
    fetchRegions: () => Promise<void>;
    addRegion: (data: { nom: string; departementId: number }) => Promise<void>;
    editRegion: (id: number, data: { nom: string; departementId: number }) => Promise<void>;
    removeRegion: (id: number) => Promise<void>;
    fetchRegionsByDepartment: (departementId: number) => Promise<IRegion[]>;
}

export const useRegionListStore = create<RegionListStore>((set, get) => ({
    regions: [],
    selectedRegion: null,

    setRegions: (regions) => {
      set({ regions });
    },

    setSelectedRegion: (selectedRegion) => {
      set({ selectedRegion });
    },

    clearRegions: () => {
      set({ regions: [] });
    },

    clearSelectedRegion: () => {
      set({ selectedRegion: null });
    },

    fetchRegions: async () => {
      try {
        const apiRegions = await apiFetchRegions();
        set({ regions: apiRegions });
      } catch (error) {
        console.log(error);
      }
    },

    addRegion: async (data) => {
      await apiCreateRegion(data);
      await get().fetchRegions();
    },

    editRegion: async (id, data) => {
      await apiUpdateRegion(id, data);
      await get().fetchRegions();
    },

    removeRegion: async (id) => {
      await apiDeleteRegion(id);
      await get().fetchRegions();
    },

    fetchRegionsByDepartment: async (departementId) => {
      return await apiFetchRegionsByDepartment(departementId);
    },
}));
  