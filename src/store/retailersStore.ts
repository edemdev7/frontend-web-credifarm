import { create } from "zustand";
import { getAllRetailers } from "../api/services/retailersServices";

export interface IRetailer {
  id: number;
  name: string;
  firstName: string | null;
  displayName: string;
  birthDay: string | null;
  paymentNumber: string;
  paymentMethod: string;
  contactMethod: string;
  e164: string;
  businessId: number;
  type: string;
  masterStatus: string;
}

interface RetailerStore {
  selectedRetailer: IRetailer | null;
  retailers: IRetailer[] | null;
  setSelectedRetailer: (retailer: IRetailer | null) => void;
  clearSelectedRetailer: () => void;
  fetchRetailers: () => Promise<void>;
}

export const useRetailerStore = create<RetailerStore>((set) => ({
  selectedRetailer: null,
  retailers: [],

  setSelectedRetailer: (retailer) => {
    set({ selectedRetailer: retailer });
  },

  clearSelectedRetailer: () => {
    set({ selectedRetailer: null });
  },

  fetchRetailers: async () => {
    try {
      set({ retailers: [] });
      // Récupérer la liste des transactions
      const response = await getAllRetailers();
      if ("results" in response.data) {
        set({ retailers: response.data.results as IRetailer[] });
      } else {
        console.error("Unexpected response format", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
