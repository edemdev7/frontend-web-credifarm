export interface IUser {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  password?: string;
  role: string;
  status?: string;
  region?: {
    id: number;
    nom: string;
    departement?: {
      id: number;
      nom: string;
    };
  };
}

export interface INewUser {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  password?: string;
  role: string;
  region_id?: number;
  department_id?: number;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  data: {
    username: string;
    userId: number;
    roles: {
      id: number;
      name: string;
    }[];
  };
}

