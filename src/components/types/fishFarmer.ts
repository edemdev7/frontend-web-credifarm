export interface IRole {
  id: number;
  nom: string;
  description: string;
  code: string;
  niveau: number;
  est_actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFishFarmer {
  id: number;
  username: string;
  email: string;
  password: string;
  prenom: string;
  nom: string;
  telephone: string;
  status: 'actif' | 'inactif';
  compte_actif: boolean;
  eligible_soa: boolean;
  date_activation: string | null;
  admin_activation: string | null;
  raison_desactivation: string | null;
  otp_code: string | null;
  otp_expire_at: string | null;
  derniereConnexion: string | null;
  createdAt: string;
  updatedAt: string;
  role: IRole;
  roleId: number;
  region: {
    id: number;
    nom: string;
    departement?: {
      id: number;
      nom: string;
    };
  } | null;
}

export interface INewFishFarmer {
  username: string;
  email: string;
  password: string;
  prenom: string;
  nom: string;
  telephone: string;
  roleId: number;
  region_id?: number;
  department_id?: number;
}

export interface IUpdateFishFarmerStatus {
  compte_actif: boolean;
  eligible_soa: boolean;
  raison_desactivation?: string;
}

export interface IFishFarmerFilters {
  status?: 'actif' | 'inactif';
  compte_actif?: boolean;
  eligible_soa?: boolean;
  region_id?: number;
  department_id?: number;
} 