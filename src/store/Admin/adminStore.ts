import { create } from "zustand";
import { IAdmin } from "../../components/types/admin";

interface AdminState {
  user: IAdmin | null;
  setAdmin: (user: IAdmin) => void;
  clearAdmin: () => void;
}

const useAdminStore = create<AdminState>((set) => ({
  user: null,
  setAdmin: (user) => set({ user }),
  clearAdmin: () => set({ user: null }),
}));

export default useAdminStore;
