import { create } from "zustand";
import { ICooperative } from "../components/types/cooperative";

interface CooperativeState {
  user: ICooperative | null;
  setCooperative: (user: ICooperative) => void;
  clearCooperative: () => void;
}

const useCooperativeStore = create<CooperativeState>((set) => ({
  user: null,
  setCooperative: (user) => set({ user }),
  clearCooperative: () => set({ user: null }),
}));

export default useCooperativeStore;
