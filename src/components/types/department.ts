export interface IDepartment {
    id: number;
    name: string;
    regions: { id: number; nom: string }[];
}
  

export interface INewDepartment {
    name: string;
}
  