// src/api/userService.ts
import { IAdmin, INewAdmin } from "../../../components/types/admin";
import { IRegion, INewRegion } from '../../../components/types/region';
import { IDepartment, INewDepartment } from '../../../components/types/department';
import { mockData } from "../../mockData";
import { toast } from "react-hot-toast";

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Récupérer le profil utilisateur
export const getAdminProfile = async (): Promise<IAdmin> => {
  await delay(500);
  return {
    id: mockData.admin.profile.id,
    name: `${mockData.admin.profile.firstName} ${mockData.admin.profile.lastName}`,
    username: mockData.admin.profile.email,
    isSuperAdmin: true,
    authKey: "mock-auth-key"
  };
};

export const isSuperAdmin = async(): Promise<boolean> => {
  const adminData = await getAdminProfile();
  return adminData.isSuperAdmin;
}

export const getAdmins = async (): Promise<IAdmin[]> => {
  await delay(500);
  return mockData.admin.admins.map(admin => ({
    id: admin.id,
    name: `${admin.firstName} ${admin.lastName}`,
    username: admin.email,
    isSuperAdmin: true,
    authKey: "mock-auth-key"
  }));
}

export const addAdmin = async (admin: INewAdmin): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Administrateur ajouté avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editAdmin = async (id: number, admin: INewAdmin): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Administrateur modifié avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteAdmin = async (adminId: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Administrateur supprimé avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const upgradeToSuperAdmin = async (adminId: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Administrateur promu avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const downgradeToAdmin = async (adminId: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Administrateur rétrogradé avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const getRegions = async (): Promise<IRegion[]> => {
  await delay(500);
  return mockData.regions.map(region => ({
    id: region.id,
    nom: region.nom,
    departement: {
      id: 1,
      nom: "Département par défaut"
    }
  }));
}

export const addRegion = async (data: INewRegion): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Région ajoutée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editRegion = async (id: number, data: INewRegion): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Région modifiée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteRegion = async (regionId: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Région supprimée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const getDepartments = async (): Promise<IDepartment[]> => {
  await delay(500);
  return mockData.departments.map(dept => ({
    id: dept.id,
    name: dept.nom,
    regions: [
      {
        id: dept.region_id,
        nom: `Région ${dept.region_id}`
      }
    ]
  }));
}

export const addDepartment = async (data: INewDepartment): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Département ajouté avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editDepartment = async (id: number, data: INewDepartment): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Département modifié avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteDepartment = async (id: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Département supprimé avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const getEntries = async (): Promise<any> => {
  await delay(500);
  return mockData.entries;
}

export const addEntry = async (data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Entrée ajoutée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editEntry = async (id: string, data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Entrée modifiée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteEntry = async (id: string): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Entrée supprimée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const getCrops = async (): Promise<any> => {
  await delay(500);
  return mockData.crops;
}

export const addCrop = async (data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Culture ajoutée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editCrop = async (id: string, data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Culture modifiée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteCrop = async (id: string): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Culture supprimée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const getCooperatives = async (): Promise<any> => {
  await delay(500);
  return mockData.cooperatives;
}

export const addCooperative = async (data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Coopérative ajoutée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const editCooperative = async (id: number, data: any): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Coopérative modifiée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}

export const deleteCooperative = async (id: number): Promise<any> => {
  await delay(500);
  const fullToken = localStorage.getItem("accessToken");
  const role = fullToken?.substring(0, 3);
  if (role === 'ADM' && await isSuperAdmin()) {
    toast.success('Coopérative supprimée avec succès');
    return { success: true };
  }
  toast.error('Vous n\'avez pas les droits pour effectuer cette action');
  return null;
}