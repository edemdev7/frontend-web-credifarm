import axiosInstance from "./axiosInstance";

// Lister toutes les régions
export const fetchRegions = async (): Promise<any[]> => {
  const response = await axiosInstance.get('/regions');
  return response.data;
};

// Créer une région
export const createRegion = async (data: { nom: string; departementId: number }): Promise<any> => {
  const response = await axiosInstance.post('/regions', data);
  return response.data;
};

// Obtenir une région par ID
export const getRegionById = async (id: number): Promise<any> => {
  const response = await axiosInstance.get(`/regions/${id}`);
  return response.data;
};

// Mettre à jour une région
export const updateRegion = async (id: number, data: { nom: string; departementId: number }): Promise<any> => {
  const response = await axiosInstance.patch(`/regions/${id}`, data);
  return response.data;
};

// Supprimer une région
export const deleteRegion = async (id: number): Promise<any> => {
  const response = await axiosInstance.delete(`/regions/${id}`);
  return response.data;
};

// Lister les régions d'un département
export const fetchRegionsByDepartment = async (departementId: number): Promise<any[]> => {
  const response = await axiosInstance.get(`/regions/by-departement/${departementId}`);
  return response.data;
};
