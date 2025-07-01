import { CooperativeCredentials, ICooperative } from "../../../components/types/cooperative";
import axiosInstance from "../../axiosInstance";
import { buildUrl } from "../../../utils/formatters";
// Récupérer le profil utilisateur
export const getCooperativeProfile = async (): Promise<ICooperative> => {
  const url = buildUrl("/cooperative/auth/profile");
  const token = localStorage.getItem("accessToken")?.substring(3)
  const response = await axiosInstance.get<ICooperative>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response.data;
};


// creation du compte cooperative
export const registerCooperative = async (
    credentials: CooperativeCredentials
    ): Promise<any> => {
      console.log(credentials);
    const response = await axiosInstance.post<any>(
        "/cooperative/auth/register",
        credentials
    );
    return response;
};

// Envoi du code OTP
export const sendOTP = async (phone: string): Promise<any> => {
  const response = await axiosInstance.post("/cooperative/auth/send-otp", { phone });
  return response;
}

// Vérification du code OTP
export const verifyOTP = async (phone: string, code: string): Promise<any> => {
    const response = await axiosInstance.post("/cooperative/auth/verify-otp", { code, phone });
    return response;
}

// Réinitialisation du mot de passe
export const forgotPassword = async (phone: string, newPassword: string, confirmPassword:string): Promise<any> => {
    console.log({ phone, newPassword, confirmPassword });
    const response = await axiosInstance.post("/cooperative/auth/forgot-password", { phone, newPassword, confirmPassword });
    return response;
}

// update profile
export const updateCooperativeProfile = async (data: any): Promise<any> =>{
  return null
}
