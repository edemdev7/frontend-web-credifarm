import { create } from "zustand";
import { IConciliationData } from "../api/services/conciliationService";

export interface ISuggestion {
  type: string;
  id: number;
  amount: number;
  merchantE164: string;
  merchantName: string;
  createdAt: string;
  score: number;
}

interface SuggestionStore {
  conciliationData: IConciliationData | null;
  suggestions: ISuggestion[] | null;
  setSuggestions: (suggestions: ISuggestion[] | null) => void;
  clearSuggestions: () => void;
  setConciliationData: (data: IConciliationData | null) => void;
}

export const useSuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: null,
  conciliationData: null,

  setSuggestions: (suggestions) => {
    set({ suggestions });
  },

  clearSuggestions: () => {
    set({ suggestions: [] });
  },

  setConciliationData: (data) => {
    set({ conciliationData: data });
  },
}));
