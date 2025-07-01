import { create } from "zustand";
import { ILoan } from "../api/services/cooperative/loanService";

export interface ISuggestion {
    id: number;
    farmer: {
        id: number,
        name: string,
    },
    cropType: string,
    cycleLenght: number,
    expectedGrossMargin: number,
    productsPriceFluctuation: number,
    productPerishability: number,
    requestDate: Date,
    updateDate: Date,
    scoreRating: number,
    status: string,
}

interface SuggestionStore {
  loanData: ILoan | null;
  suggestions: ISuggestion[] | null;
  setSuggestions: (suggestions: ISuggestion[] | null) => void;
  clearSuggestions: () => void;
  setLoanData: (data: ILoan | null) => void;
}

export const useLoanSuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: null,
  loanData: null,

  setSuggestions: (suggestions) => {
    set({ suggestions });
  },

  clearSuggestions: () => {
    set({ suggestions: [] });
  },

  setLoanData: (data: ILoan | null) => {
    set({ loanData: data });
  },
}));
