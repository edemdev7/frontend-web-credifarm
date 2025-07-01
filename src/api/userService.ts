import axiosInstance from "./axiosInstance";
import { IUser, INewUser } from "../components/types/user";

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const createUser = async (data: INewUser): Promise<IUser> => {
  const response = await axiosInstance.post("/users", data);
  return response.data;
};

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<INewUser>): Promise<IUser> => {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<any> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
}; 