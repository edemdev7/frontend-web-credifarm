// src/api/userService.ts
import { Credentials, IUser, LoginResponse } from "../../components/types/user";
import axiosInstance from "../axiosInstance";

// Récupérer le profil utilisateur
export const getUserProfile = async (): Promise<IUser> => {
  const response = await axiosInstance.get<IUser>("/user/profile");
  return response.data;
};

// Connexion de l'utilisateur
export const loginUser = async (
  credentials: Credentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/login",
    credentials
  );
  return response.data;
};
