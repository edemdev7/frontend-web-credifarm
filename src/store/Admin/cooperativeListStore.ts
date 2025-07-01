import { create } from "zustand";
import { ICooperative } from "../../components/types/cooperative";
import {
    getCooperatives,
  } from "../../api/services/admin/adminService";

interface CooperativeListStore {
    cooperatives: ICooperative[];
    selectedCooperative: ICooperative | null;
    setCooperatives: (cooperatives: ICooperative[]) => void;
    setSelectedCooperative: (selectedCooperative: ICooperative | null) => void;
    clearCooperatives: () => void;
    clearSelectedCooperative: () => void;
    fetchCooperatives: () => Promise<void>;
}
  
  export const useCooperativeListStore = create<CooperativeListStore>((set) => ({
    cooperatives: [],
    selectedCooperative: null,
  
    setCooperatives: (cooperatives) => {
      set({ cooperatives });
    },
  
    setSelectedCooperative: (selectedCooperative) => {
      set({ selectedCooperative });
    },
  
    clearCooperatives: () => {
      set({ cooperatives: [] });
    },
  
    clearSelectedCooperative: () => {
      set({ selectedCooperative: null });
    },
  
    fetchCooperatives: async () => {
      try {
        set({ cooperatives: [] });
        // Récupérer la liste des cooperatives
        const response = await getCooperatives();
        set({ cooperatives: response as unknown as ICooperative[] });
      } catch (error) {
        console.log(error);
      }
    },
  }));
  