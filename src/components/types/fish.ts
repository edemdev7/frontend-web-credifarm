// Types pour les espèces de poissons
export interface IFishSpecies {
  id: number;
  nom: string;
  nom_scientifique: string;
  famille: string;
  taille_moyenne: number; // en cm
  poids_moyen: number; // en grammes
  duree_vie: number; // en années
  temperature_optimale: {
    min: number;
    max: number;
  };
  ph_optimal: {
    min: number;
    max: number;
  };
  description: string;
  image_url?: string;
  statut: 'ACTIF' | 'INACTIF';
  date_creation: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateFishSpecies {
  nom: string;
  nom_scientifique: string;
  famille: string;
  taille_moyenne: number;
  poids_moyen: number;
  duree_vie: number;
  temperature_optimale: {
    min: number;
    max: number;
  };
  ph_optimal: {
    min: number;
    max: number;
  };
  description: string;
  image?: File;
}

export interface IUpdateFishSpecies {
  nom?: string;
  nom_scientifique?: string;
  famille?: string;
  taille_moyenne?: number;
  poids_moyen?: number;
  duree_vie?: number;
  temperature_optimale?: {
    min: number;
    max: number;
  };
  ph_optimal?: {
    min: number;
    max: number;
  };
  description?: string;
  image?: File;
  statut?: 'ACTIF' | 'INACTIF';
}

// Types pour les aliments pour poissons
export interface IFishFood {
  id: number;
  nom: string;
  marque: string;
  type: 'GRANULES' | 'FLOCONS' | 'PAILLETTES' | 'PATE' | 'VIANDE';
  taille_granule?: string; // pour les granulés
  composition: string;
  proteines: number; // pourcentage
  lipides: number; // pourcentage
  glucides: number; // pourcentage
  fibres: number; // pourcentage
  cendres: number; // pourcentage
  humidite: number; // pourcentage
  energie: number; // kcal/100g
  especes_compatibles: number[]; // IDs des espèces compatibles
  stade_vie: 'ALEVINS' | 'JUVENILES' | 'ADULTES' | 'REPRODUCTEURS' | 'TOUS';
  frequence_alimentation: string;
  quantite_recommandee: string;
  prix_unitaire: number; // FCFA/kg
  stock_disponible: number; // kg
  description: string;
  image_url?: string;
  statut: 'ACTIF' | 'INACTIF' | 'RUPTURE';
  date_creation: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateFishFood {
  nom: string;
  marque: string;
  type: 'GRANULES' | 'FLOCONS' | 'PAILLETTES' | 'PATE' | 'VIANDE';
  taille_granule?: string;
  composition: string;
  proteines: number;
  lipides: number;
  glucides: number;
  fibres: number;
  cendres: number;
  humidite: number;
  energie: number;
  especes_compatibles: number[];
  stade_vie: 'ALEVINS' | 'JUVENILES' | 'ADULTES' | 'REPRODUCTEURS' | 'TOUS';
  frequence_alimentation: string;
  quantite_recommandee: string;
  prix_unitaire: number;
  stock_disponible: number;
  description: string;
  image?: File;
}

export interface IUpdateFishFood {
  nom?: string;
  marque?: string;
  type?: 'GRANULES' | 'FLOCONS' | 'PAILLETTES' | 'PATE' | 'VIANDE';
  taille_granule?: string;
  composition?: string;
  proteines?: number;
  lipides?: number;
  glucides?: number;
  fibres?: number;
  cendres?: number;
  humidite?: number;
  energie?: number;
  especes_compatibles?: number[];
  stade_vie?: 'ALEVINS' | 'JUVENILES' | 'ADULTES' | 'REPRODUCTEURS' | 'TOUS';
  frequence_alimentation?: string;
  quantite_recommandee?: string;
  prix_unitaire?: number;
  stock_disponible?: number;
  description?: string;
  image?: File;
  statut?: 'ACTIF' | 'INACTIF' | 'RUPTURE';
} 