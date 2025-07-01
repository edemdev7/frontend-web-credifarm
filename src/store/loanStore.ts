import { create } from "zustand";
import {
  ILoan,
  getLoans,
} from "../api/services/cooperative/loanService";

interface LoanStore {
  loans: ILoan[];
  selectedLoan: ILoan | null;
  setLoans: (loans: ILoan[]) => void;
  setSelectedLoan: (selectedLoan: ILoan | null) => void;
  clearLoans: () => void;
  clearSelectedLoan: () => void;
  fetchLoans: () => Promise<void>;
}

export const useLoanStore = create<LoanStore>((set) => ({
  loans: [],
  selectedLoan: null,

  setLoans: (loans) => {
    set({ loans });
  },

  setSelectedLoan: (selectedLoan) => {
    set({ selectedLoan });
  },

  clearLoans: () => {
    set({ loans: [] });
  },

  clearSelectedLoan: () => {
    set({ selectedLoan: null });
  },

  fetchLoans: async () => {
    try {
      set({ loans: [] });
      // Récupérer la liste des loans
      const response = await getLoans();
      set({ loans: response as unknown as ILoan[] });
    } catch (error) {
      console.log(error);
    }
  },
}));
