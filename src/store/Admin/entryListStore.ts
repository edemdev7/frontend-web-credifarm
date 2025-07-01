import { create } from "zustand";
import { IEntry } from "../../components/types/entry";
import {
    getEntries,
  } from "../../api/services/admin/adminService";

interface EntryListStore {
    entries: IEntry[];
    selectedEntry: IEntry | null;
    setEntries: (entries: IEntry[]) => void;
    setSelectedEntry: (selectedEntry: IEntry | null) => void;
    clearEntries: () => void;
    clearSelectedEntry: () => void;
    fetchEntries: () => Promise<void>;
}
  
  export const useEntryListStore = create<EntryListStore>((set) => ({
    entries: [],
    selectedEntry: null,
  
    setEntries: (entries) => {
      set({ entries });
    },
  
    setSelectedEntry: (selectedEntry) => {
      set({ selectedEntry });
    },
  
    clearEntries: () => {
      set({ entries: [] });
    },
  
    clearSelectedEntry: () => {
      set({ selectedEntry: null });
    },
  
    fetchEntries: async () => {
      try {
        set({ entries: [] });
        // Récupérer la liste des entries
        const response = await getEntries();
        set({ entries: response as unknown as IEntry[] });
      } catch (error) {
        console.log(error);
      }
    },
  }));
  