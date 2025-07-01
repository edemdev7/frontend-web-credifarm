import { IResponse } from "../../components/types/global";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface IDisbursement {
  id: number;
  effectiveDisbursementDate?: string;
  isDisbursed: boolean;
  createdAt: string;
  disbursementDate: string;
  supplier: {
    id: number;
    displayName: string;
    paymentMethod?: string;
    paymentNumber?: string;
  };
  transaction: {
    id: number;
    amount: number;
  };
  transactionId: number;
  status: "INIT" | "PENDING" | "PAYED" | "FAILED";
}

export interface IDisbursementData {
  txIds: string[];
  supplierId: number;
}

// Récupérer la liste des décaissements
export const getAllDisbursements = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/disbursements", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour un décaissement
export const updateDisbursement = async (
  transactionId: number,
  data: Partial<IDisbursement>
): Promise<IResponse> => {
  const url = buildUrl(`/disbursements/${transactionId}`);
  const response = await axiosInstance.patch<IResponse>(url, data);
  return response.data;
};

// Faire une déboursement
export const processDisbursement = async (
  data: IDisbursementData
): Promise<IResponse> => {
  const url = buildUrl("/disbursements/process");
  const response = await axiosInstance.post<IResponse>(url, data);
  return response.data;
};
