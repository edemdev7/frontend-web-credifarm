import { create } from "zustand";
import { IDepartment } from "../../components/types/department";
import {
    fetchDepartments as apiFetchDepartments,
    createDepartment as apiCreateDepartment,
    updateDepartment as apiUpdateDepartment,
    deleteDepartment as apiDeleteDepartment,
    getDepartmentById as apiGetDepartmentById
} from "../../api/department";

interface DepartmentListStore {
    departments: IDepartment[];
    selectedDepartment: IDepartment | null;
    setDepartments: (departments: IDepartment[]) => void;
    setSelectedDepartment: (selectedDepartment: IDepartment | null) => void;
    clearDepartments: () => void;
    clearSelectedDepartment: () => void;
    fetchDepartments: () => Promise<void>;
    addDepartment: (data: { nom: string }) => Promise<void>;
    editDepartment: (id: number, data: { nom: string }) => Promise<void>;
    removeDepartment: (id: number) => Promise<void>;
}

export const useDepartmentListStore = create<DepartmentListStore>((set, get) => ({
    departments: [],
    selectedDepartment: null,

    setDepartments: (departments) => {
      set({ departments });
    },

    setSelectedDepartment: (selectedDepartment) => {
      set({ selectedDepartment });
    },

    clearDepartments: () => {
      set({ departments: [] });
    },

    clearSelectedDepartment: () => {
      set({ selectedDepartment: null });
    },

    fetchDepartments: async () => {
      try {
        const apiDepartments = await apiFetchDepartments();
        // Mapping API → FE
        const departments: IDepartment[] = apiDepartments.map((d: any) => ({
          id: d.id,
          name: d.nom,
          regions: d.regions || []
        }));
        set({ departments });
      } catch (error) {
        console.log(error);
      }
    },

    addDepartment: async (data) => {
      await apiCreateDepartment(data);
      await get().fetchDepartments();
    },

    editDepartment: async (id, data) => {
      await apiUpdateDepartment(id, data);
      await get().fetchDepartments();
    },

    removeDepartment: async (id) => {
      await apiDeleteDepartment(id);
      await get().fetchDepartments();
    },
}));
  