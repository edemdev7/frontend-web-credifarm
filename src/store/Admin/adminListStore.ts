import { create } from "zustand";
import { IAdmin } from "../../components/types/admin";
import {
    getAdmins,
  } from "../../api/services/admin/adminService";

interface AdminListStore {
    admins: IAdmin[];
    selectedAdmin: IAdmin | null;
    setAdmins: (admins: IAdmin[]) => void;
    setSelectedAdmin: (selectedAdmin: IAdmin | null) => void;
    clearAdmins: () => void;
    clearSelectedAdmin: () => void;
    fetchAdmins: () => Promise<void>;
}
  
  export const useAdminListStore = create<AdminListStore>((set) => ({
    admins: [],
    selectedAdmin: null,
  
    setAdmins: (admins) => {
      set({ admins });
    },
  
    setSelectedAdmin: (selectedAdmin) => {
      set({ selectedAdmin });
    },
  
    clearAdmins: () => {
      set({ admins: [] });
    },
  
    clearSelectedAdmin: () => {
      set({ selectedAdmin: null });
    },
  
    fetchAdmins: async () => {
      try {
        set({ admins: [] });
        // Récupérer la liste des admins
        const response = await getAdmins();
        set({ admins: response as unknown as IAdmin[] });
      } catch (error) {
        console.log(error);
      }
    },
  }));
  