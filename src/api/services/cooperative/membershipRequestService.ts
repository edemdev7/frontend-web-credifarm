import { IResponse } from "../../../components/types/global";
import { buildUrl } from "../../../utils/formatters";
import axiosInstance from "../../axiosInstance";

export interface IMembershipRequest {
    id: number;
    farmer: {
        id: number,
        name: string,
        phone: string,
        region: {
            id: number,
            name: string
        },
        department: {
            id: number,
            name: string
        },
        village: string,
        dateOfBirth: Date,
        gender: boolean,
        phoneType: number,
        maritalStatus: number,
        hasBankAccount: boolean,
        dependents: number,
        educationLevel: number,
        mainActivity: number,
        otherMainActivity: string,
        secondaryActivities: number[],
        otherSecondaryActivity: string,
        landExploitationType: number,
        farmingExperience: number,
        agriculturalTrainingType: number,
        farmMonitoring: number,
        TotalAmountActiveLoans: number,
        TotalAmountPaidLoans: number, 
    },
    requestDate: Date,
    status: string,
    
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
export const getMembershipRequests = async (
  params?: Record<string, string | number | boolean>
): Promise<IMembershipRequest[]> => {
  const url = buildUrl("/cooperative/membership-requests", params);
  const token = localStorage.getItem("accessToken")?.substring(3)
  const response = await axiosInstance.get<IMembershipRequest[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  console.log('response',response);
  return response.data;
};

export const acceptMembershipRequest = async (
  id: number,
): Promise<any> => {
  const url = `/cooperative/membership-requests/${id}/accept`;
  const token = localStorage.getItem("accessToken")?.substring(3);
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const rejectMembershipRequest = async (
  id: number,
): Promise<any> => {
  const url = `/cooperative/membership-requests/${id}/reject`;
  const token = localStorage.getItem("accessToken")?.substring(3);
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

// Mettre à jour une transaction existante
export const updateMembershipRequest = async (
  id: number,
  transactionData: Partial<IMembershipRequest>
): Promise<IResponse> => {
  const url = `/membershipRequests/${id}`;
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
