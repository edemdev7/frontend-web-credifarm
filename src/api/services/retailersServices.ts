import { Step1FormData } from "../../components/types/form";
import { IResponse } from "../../components/types/global";
import { IRetailer } from "../../store/retailersStore";
import { buildUrl } from "../../utils/formatters";
import axiosInstance from "../axiosInstance";

export interface IRetailerResponse {
  data: IRetailer[];
}

// Récupérer un retailer par ID
export const getRetailerById = async (
  id: number,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/merchant/${id}`, params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Récupérer tous les retailers
export const getAllRetailers = async (
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl("/merchants", params);
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};

// Mettre à jour un retailer
export const updateRetailer = async (
  id: number,
  retailerData: Partial<IRetailer>,
  params?: Record<string, string | number | boolean>
): Promise<IResponse> => {
  const url = buildUrl(`/retailer/${id}`, params);
  const response = await axiosInstance.patch<IResponse>(url, retailerData);
  return response.data;
};

// Créer un nouveau retailer
export const createRetailer = async (
  retailerData: Step1FormData
): Promise<IResponse> => {
  const url = "/retailer";
  const response = await axiosInstance.post<IResponse>(url, retailerData);
  return response.data;
};
