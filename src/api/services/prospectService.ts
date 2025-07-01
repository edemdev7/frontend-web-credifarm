import { Step1FormData } from "../../components/types/form";
import { IResponse } from "../../components/types/global";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

// Récupérer la liste des prospects
export const getProspects = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/prospects", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer un prospect par ID
export const getClientById = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/clients/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer un supplier par ID
export const getSupplierById = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/supplier/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer la limite d'un marchand par ID
export const getMerchantLimit = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/merchants/${id}/limit`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer la limite d'un marchand par ID
export const getMerchant = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/merchants/${id}/details`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer le solde d'un marchand par ID
export const getMerchantBalance = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/merchants/${id}/balance`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour la limite d'un marchand
export const updateMerchantLimit = async (
  id: number,
  data: { limit: string | number }
): Promise<IResponse> => {
  const url = buildUrl(`/merchants/${id}/limit`);
  const response = await axiosInstance.patch<IResponse>(url, data);
  return response.data;
};

// Mettre à jour le solde d'un marchand
export const updateMerchantBalance = async (
  id: number,
  data: { balance: string | number }
): Promise<IResponse> => {
  const url = buildUrl(`/merchants/${id}/balance`);
  const response = await axiosInstance.patch<IResponse>(url, data);
  return response.data;
};

// Créer un nouveau prospect
export const createProspect = async (
  data: Step1FormData
): Promise<IResponse> => {
  const url = buildUrl("/prospects");
  const response = await axiosInstance.post<IResponse>(url, data);
  return response.data;
};

// Mettre à jour un prospect
export const updateProspect = async (
  id: number,
  data: unknown
): Promise<IResponse> => {
  const url = buildUrl(`/prospects/${id}`);
  const response = await axiosInstance.patch<IResponse>(url, data);
  return response.data;
};

// Soumettre Danaya
export const submitDanaya = async (formData: FormData): Promise<unknown> => {
  const url = buildUrl("/upload-danaya");
  const response = await axiosInstance.post<unknown>(url, formData);
  return response.data;
};

// Créer un nouveau client
export const createClient = async (data: unknown): Promise<IResponse> => {
  const url = buildUrl("/clients");
  const response = await axiosInstance.post<IResponse>(url, data);
  return response.data;
};

// Mettre à jour un client
export const updateClient = async (
  id: number,
  data: unknown
): Promise<IResponse> => {
  const url = buildUrl(`/clients/${id}`);
  const response = await axiosInstance.patch<IResponse>(url, data);
  return response.data;
};
