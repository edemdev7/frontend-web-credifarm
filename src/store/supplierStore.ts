import { create } from "zustand";

export interface ISupplier {
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

interface SupplierStore {
  selectedSupplier: ISupplier | null;
  setSelectedSupplier: (supplier: ISupplier | null) => void;
  clearSelectedSupplier: () => void;
}

export const useSupplierStore = create<SupplierStore>((set) => ({
  selectedSupplier: null,

  setSelectedSupplier: (supplier) => {
    set({ selectedSupplier: supplier });
  },

  clearSelectedSupplier: () => {
    set({ selectedSupplier: null });
  },
}));
