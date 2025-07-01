import { create } from "zustand";
import { ICrop } from "../../components/types/crop";
import {
    getCrops,
  } from "../../api/services/admin/adminService";

interface CropListStore {
    crops: ICrop[];
    selectedCrop: ICrop | null;
    setCrops: (crops: ICrop[]) => void;
    setSelectedCrop: (selectedCrop: ICrop | null) => void;
    clearCrops: () => void;
    clearSelectedCrop: () => void;
    fetchCrops: () => Promise<void>;
}
  
  export const useCropListStore = create<CropListStore>((set) => ({
    crops: [],
    selectedCrop: null,
  
    setCrops: (crops) => {
      set({ crops });
    },
  
    setSelectedCrop: (selectedCrop) => {
      set({ selectedCrop });
    },
  
    clearCrops: () => {
      set({ crops: [] });
    },
  
    clearSelectedCrop: () => {
      set({ selectedCrop: null });
    },
  
    fetchCrops: async () => {
      try {
        set({ crops: [] });
        // Récupérer la liste des crops
        const response = await getCrops();
        set({ crops: response as unknown as ICrop[] });
      } catch (error) {
        console.log(error);
      }
    },
  }));
  