import axiosInstance from "./axiosInstance";

// Lister tous les départements
export const fetchDepartments = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get('/departements');
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Créer un département
export const createDepartment = async (data: { nom: string }): Promise<any> => {
  const response = await axiosInstance.post('/departements', data);
  return response.data;
};

// Obtenir un département par ID
export const getDepartmentById = async (id: number): Promise<any> => {
  const response = await axiosInstance.get(`/departements/${id}`);
  return response.data;
};

// Mettre à jour un département
export const updateDepartment = async (id: number, data: { nom: string }): Promise<any> => {
  const response = await axiosInstance.patch(`/departements/${id}`, data);
  return response.data;
};

// Supprimer un département
export const deleteDepartment = async (id: number): Promise<any> => {
  const response = await axiosInstance.delete(`/departements/${id}`);
  return response.data;
};
