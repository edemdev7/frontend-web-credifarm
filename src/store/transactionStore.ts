import { create } from "zustand";
import {
  ITransaction,
  getTransactions,
} from "../api/services/transactionService";

interface TransactionStore {
  transactions: ITransaction[];
  selectedTransaction: ITransaction | null;
  setTransactions: (transactions: ITransaction[]) => void;
  setSelectedTransaction: (selectedTransaction: ITransaction | null) => void;
  clearTransactions: () => void;
  clearSelectedTransaction: () => void;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  selectedTransaction: null,

  setTransactions: (transactions) => {
    set({ transactions });
  },

  setSelectedTransaction: (selectedTransaction) => {
    set({ selectedTransaction });
  },

  clearTransactions: () => {
    set({ transactions: [] });
  },

  clearSelectedTransaction: () => {
    set({ selectedTransaction: null });
  },

  fetchTransactions: async () => {
    try {
      set({ transactions: [] });
      // Récupérer la liste des transactions
      const response = await getTransactions();
      set({ transactions: response.data as unknown as ITransaction[] });
    } catch (error) {
      console.log(error);
    }
  },
}));
