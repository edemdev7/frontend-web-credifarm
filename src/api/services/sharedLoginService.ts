import { AdminLoginResponse } from "../../components/types/admin";
import { SharedCredentials } from '../../components/types/sharedCredentials';
import axiosInstance from "../axiosInstance";
import { CooperativeLoginResponse } from "../../components/types/cooperative";
import useAdminStore from '../../store/Admin/adminStore';
import useUserStore from '../../store/userStore';

export const sharedLogin = async (
    credentials: SharedCredentials
  ): Promise<any> => {
    // Appel réel à l'API d'authentification
    const response = await axiosInstance.post('/auth/login', credentials);
    const { access_token, user } = response.data;
    // Stocker le token et l'utilisateur dans le localStorage
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    // Synchroniser le store zustand
    if (user.role && user.role.code === 'ADMIN') {
      useAdminStore.getState().setAdmin(user);
    } else {
      useUserStore.getState().setUser(user);
    }
    return response;
};