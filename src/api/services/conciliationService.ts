import { IResponse } from "../../components/types/global";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface IConciliation {
  id: number;
  julayaId: string;
  remainingAmount: number;
  amount: number;
  clientNumber: string;
  account: string;
  date: string;
  status: string;
}

export interface IConciliationData {
  idJulaya?: number;
  referenceId?: number;
  amount?: number;
}

// Récupérer la liste des conciliations
export const getConciliations = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/conciliation/repayments", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Faire une conciliation
export const processConciliation = async (
  data: IConciliationData
): Promise<IResponse> => {
  const url = buildUrl("/conciliation/process");
  const response = await axiosInstance.post<IResponse>(url, data);
  return response.data;
};

// Récupérer les recommandations d'un paiement
export const getPaymentRecommendations = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(
    `/conciliation/repayments/${id}/recommandations`,
    params
  );
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Obtenir une recommandation en fonction d'une transaction
export const getRecommendationByTransaction = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/conciliation/recommandations/tx/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};
