export interface IMember {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  region: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  village: string;
  gender: boolean;
  basins?: {
    id: number;
    name: string;
    surfaceArea: number;
    capacity: number;
  }[];
  species?: {
    id: number;
    name: string;
    quantity: number;
  }[];
  status: 'ACTIVE' | 'INACTIVE';
  joinedCooperativeAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemberFormData {
  name: string;
  phone?: string;
  email?: string;
  region: string;
  department: string;
  village: string;
  gender: boolean;
  species?: string[];
  status: 'ACTIVE' | 'INACTIVE';
} 