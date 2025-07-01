import { Step1FormDataS } from "../../components/types/form";
import { IResponse } from "../../components/types/global";
import { ISupplier } from "../../store/supplierStore";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface ISupplierResponse {
  data: ISupplier[];
}

// Récupérer un supplier par ID
export const getSupplierById = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/supplier/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer tous les suppliers
export const getAllSuppliers = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/suppliers", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour un supplier
export const updateSupplier = async (
  id: number,
  supplierData: Partial<ISupplier>,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/supplier/${id}`, params);
  const response = await axiosInstance.patch<IResponse>(url, supplierData);
  return response.data;
};

// Créer un nouveau supplier
export const createSupplier = async (
  supplierData: Step1FormDataS
): Promise<IResponse> => {
  const url = "/supplier";
  const response = await axiosInstance.post<IResponse>(url, supplierData);
  return response.data;
};
