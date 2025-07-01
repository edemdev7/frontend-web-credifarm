import { IResponse } from "../../../types/global";
import { buildUrl } from "../../../utils/api";
import axiosInstance from "../../../api/axiosInstance";
import { mockData } from "../../mockData";
import { IMember, IMemberFormData } from "../../../components/types/member";

export interface IPromiseData {
  respected: boolean;
}

export interface IPromise {
  id: number;
  promiseDate: string;
  amount: number;
  respected: boolean | undefined;
}

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Récupérer la liste des pisciculteurs
export const getMembers = async (
  params?: Record<string, string | number | boolean>
): Promise<IMember[]> => {
  await delay(500);
  return mockData.members;
};

export const cancelMembership = async (id: number): Promise<IResponse> => {
  await delay(500);
  return { success: true, status: 201 };
};

export const addMember = async (formData: IMemberFormData): Promise<IResponse> => {
  await delay(500);
  return { success: true, status: 201 };
};

// Mettre à jour un pisciculteur existant
export const updateMember = async (
  id: number,
  memberData: Partial<IMemberFormData>
): Promise<IResponse> => {
  await delay(500);
  return { success: true, status: 201 };
};

