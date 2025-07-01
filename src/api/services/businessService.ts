import { IResponse } from "../../components/types/global";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface IBusiness {
  id: number;
  businessType: string; // Type de commerce
  vertical: string; // Verticale
  role: string; // Fonction
  segment: string; // Segment
  suppliers: number[]; // Fournisseurs
  supplyFrequencyPerMonth: number; // Fréquence de réapprovisionnement
  averageAmount: string; // Montant moyen
  businessForm: string; // Forme d'activité
  paymentMethod: string; // Méthode de paiement
  supplierRelationshipDurationMonths: number; // Durée relation fournisseur en mois
  commentStep2?: string; // Commentaire étape 2
}

export interface IBusinessResponse {
  data: IBusiness[];
}

// Récupérer un business par ID
export const getBusinessById = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/business/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer tous les businesses
export const getAllBusinesses = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/business", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour un business
export const updateBusiness = async (
  id: number,
  businessData: unknown
): Promise<IResponse> => {
  const url = `/business/${id}`;
  const response = await axiosInstance.patch<IResponse>(url, businessData);
  return response.data;
};

// Créer un nouveau business
export const createBusiness = async (
  id: number,
  businessData: unknown,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/business/${id}`, params);
  const response = await axiosInstance.post<IResponse>(url, businessData);
  return response.data;
};
