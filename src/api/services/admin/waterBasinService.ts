import { 
  IBassin, 
  ICreateBassin, 
  IUpdateBassin, 
  IAssignBassin,
  IPerformance,
  ICreatePerformance,
  IPecheControle,
  ICreatePecheControle,
  IBassinStats,
  IPerformanceStats,
  IPecheControleStats
} from "../../../components/types/waterBasin";
import axiosInstance from "../../axiosInstance";
import { IResponse } from "../../../components/types/global";

// ===== GESTION DES BASSINS =====

export const getBassins = async (): Promise<IBassin[]> => {
  try {
    console.log('Appel API getBassins...');
    const response = await axiosInstance.get('/bassins');
    console.log('Réponse API getBassins:', response);
    console.log('Données reçues:', response.data);
    
    // L'API retourne directement un tableau, pas un objet avec un champ data
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn('Structure de réponse inattendue:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des bassins:', error);
    return [];
  }
};

export const getBassin = async (id: number): Promise<IBassin> => {
  const response = await axiosInstance.get<IResponse<IBassin>>(`/bassins/${id}`);
  return response.data.data;
};

export const createBassin = async (data: ICreateBassin): Promise<IBassin> => {
  const response = await axiosInstance.post<IResponse<IBassin>>('/bassins', data);
  return response.data.data;
};

export const updateBassin = async (id: number, data: IUpdateBassin): Promise<IBassin> => {
  const response = await axiosInstance.patch<IResponse<IBassin>>(`/bassins/${id}`, data);
  return response.data.data;
};

export const deleteBassin = async (id: number): Promise<void> => {
  await axiosInstance.delete<IResponse<void>>(`/bassins/${id}`);
};

// ===== GESTION DES ASSIGNATIONS =====

export const assignBassin = async (data: IAssignBassin): Promise<any> => {
  const response = await axiosInstance.post<IResponse<any>>('/bassins/assign', data);
  return response.data.data;
};

export const unassignBassin = async (bassinId: number, pisciculteurId: number): Promise<void> => {
  await axiosInstance.post<IResponse<void>>(`/bassins/${bassinId}/unassign/${pisciculteurId}`);
};

// ===== REQUÊTES SPÉCIALISÉES =====

export const getBassinsByPisciculteur = async (pisciculteurId: number): Promise<IBassin[]> => {
  const response = await axiosInstance.get<IResponse<IBassin[]>>(`/bassins/pisciculteur/${pisciculteurId}`);
  return response.data.data || [];
};

export const getBassinsByPisciculteurDetailed = async (pisciculteurId: number): Promise<IBassin[]> => {
  const response = await axiosInstance.get<IResponse<IBassin[]>>(`/bassins/pisciculteur/${pisciculteurId}/detailed`);
  return response.data.data || [];
};

export const getBassinsSansPisciculteur = async (): Promise<IBassin[]> => {
  const response = await axiosInstance.get<IResponse<IBassin[]>>('/bassins/sans-pisciculteur');
  return response.data.data || [];
};

export const getBassinsByStatus = async (status: string): Promise<IBassin[]> => {
  const response = await axiosInstance.get<IResponse<IBassin[]>>(`/bassins/status/${status}`);
  return response.data.data || [];
};

export const getBassinsByRegion = async (regionId: number): Promise<IBassin[]> => {
  const response = await axiosInstance.get<IResponse<IBassin[]>>(`/bassins/region/${regionId}`);
  return response.data.data || [];
};

export const getBassinsStats = async (): Promise<IBassinStats> => {
  const response = await axiosInstance.get<IResponse<IBassinStats>>('/bassins/summary/statistiques');
  return response.data.data;
};

// ===== GESTION DES PERFORMANCES =====

export const createPerformance = async (bassinId: number, data: ICreatePerformance): Promise<IPerformance> => {
  const response = await axiosInstance.post<IResponse<IPerformance>>(`/bassins/${bassinId}/performances`, data);
  return response.data.data;
};

export const getPerformances = async (bassinId: number): Promise<IPerformance[]> => {
  const response = await axiosInstance.get<IResponse<IPerformance[]>>(`/bassins/${bassinId}/performances`);
  return response.data.data || [];
};

export const getPerformanceStats = async (bassinId: number): Promise<IPerformanceStats> => {
  const response = await axiosInstance.get<IResponse<IPerformanceStats>>(`/bassins/${bassinId}/performances/statistiques`);
  return response.data.data;
};

// ===== GESTION DES PÊCHES DE CONTRÔLE =====

export const createPecheControle = async (bassinId: number, data: ICreatePecheControle): Promise<IPecheControle> => {
  const response = await axiosInstance.post<IResponse<IPecheControle>>(`/bassins/${bassinId}/peches-controle`, data);
  return response.data.data;
};

export const getPechesControle = async (bassinId: number): Promise<IPecheControle[]> => {
  const response = await axiosInstance.get<IResponse<IPecheControle[]>>(`/bassins/${bassinId}/peches-controle`);
  return response.data.data || [];
};

export const getPecheControleStats = async (bassinId: number): Promise<IPecheControleStats> => {
  const response = await axiosInstance.get<IResponse<IPecheControleStats>>(`/bassins/${bassinId}/peches-controle/statistiques`);
  return response.data.data;
}; 