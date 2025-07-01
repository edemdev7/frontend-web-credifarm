export interface IRegion {
    id: number;
    nom: string;
    departement: {
        id: number;
        nom: string;
    };
    users?: any[];
    bassins?: any[];
}
  

export interface INewRegion {
    nom: string;
    departementId: number;
}
  