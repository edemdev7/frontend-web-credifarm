import { IResponse } from "../../components/types/global";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface ITransaction {
  id: number;
  merchantDisplayName: string;
  supplierDisplayName: string;
  paymentPromises: {
    date: string;
    promiseDate: string;
    amount: number;
    id: number;
    respected: boolean | undefined;
  }[];
  overdueDays: number;
  totalPrice: number;
  overdueFee: string;
  fee: string;
  createdAt: string;
  maturityDate: string;
  type: string;
  isActive: boolean;
  totalDue: number;
  liquidityPocket: string;
  merchantPhone: string;
}

export interface IPromiseData {
  respected: boolean;
}
export interface IPromise {
  id: number;
  promiseDate: string;
  amount: number;
  respected: boolean | undefined;
}

// Récupérer la liste des transactions (Eventuellement des suppliers ou des merchants uniquement)
export const getTransactions = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/transactions", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour une transaction existante
export const updateTransaction = async (
  id: number,
  transactionData: Partial<ITransaction>
): Promise<IResponse> => {
  const url = `/transactions/${id}`;
  const response = await axiosInstance.patch<IResponse>(url, transactionData);
  return response.data;
};

// Créer une promesse de paiement
export const createPromise = async (
  id: number, // id de la transaction
  promiseData: Partial<IPromiseData>
): Promise<IResponse> => {
  const url = `/transactions/${id}/payment-promise`;
  const response = await axiosInstance.post<IResponse>(url, promiseData);
  return response.data;
};

// Mettre à jour une promesse de paiement existante
export const updatePromise = async (
  promiseId: number, // id de la promesse
  promiseData: Partial<IPromiseData>
): Promise<IResponse> => {
  const url = `/payment-promises/${promiseId}`;
  const response = await axiosInstance.patch<IResponse>(url, promiseData);
  return response.data;
};
// Mettre à jour une promesse de paiement existante
export const getPromises = async (): Promise<IResponse> => {
  const url = `/payment-promises/`;
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};
