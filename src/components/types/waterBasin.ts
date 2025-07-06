// Types pour les bassins selon l'API
export interface IBassin {
  id: number;
  nom: string;
  superficie: string | number; // Le backend retourne parfois une string
  profondeur?: string | number; // Le backend retourne parfois une string
  type?: string;
  capacite_max?: number;
  type_poisson?: string;
  description?: string | null;
  est_actif?: boolean;
  statut: 'ACTIF' | 'INACTIF' | 'EN_MAINTENANCE';
  date_creation: string;
  admin_id?: number;
  created_at?: string;
  updated_at?: string;
  region?: {
    id: number;
    nom: string;
    departement?: {
      id: number;
      nom: string;
    };
  };
  pisciculteur_assigne?: {
    id: number;
    nom: string;
    prenom: string;
  };
  performances?: IPerformance[];
  peches_controle?: IPecheControle[];
  calendrier_recolte?: ICalendrierRecolte[];
  calendrier_intrants?: ICalendrierIntrants[];
}

export interface ICreateBassin {
  nom: string;
  superficie: number;
  profondeur: number;
  type: string;
  capacite_max?: number;
  type_poisson?: string;
  date_creation: string;
  region_id: number;
}

export interface IUpdateBassin {
  nom?: string;
  superficie?: number;
  profondeur?: number;
  type?: string;
  statut?: 'ACTIF' | 'INACTIF' | 'EN_MAINTENANCE';
  capacite_max?: number;
  type_poisson?: string;
  description?: string;
}

export interface IAssignBassin {
  bassin_id: number;
  pisciculteur_id: number;
}

// Types pour les performances
export interface IPerformance {
  id: number;
  nombre_poissons: number;
  poids_total: string;
  poids_moyen: string;
  taux_mortalite: string;
  taux_croissance: string;
  taux_conversion_alimentaire?: string;
  observations?: string;
  date_mesure: string;
  bassinId?: number;
}

export interface ICreatePerformance {
  nombre_poissons: number;
  poids_total: number;
  poids_moyen: number;
  taux_mortalite: number;
  taux_croissance: number;
  taux_conversion_alimentaire?: number;
  observations?: string;
}

// Types pour les pêches de contrôle
export interface IPecheControle {
  id: number;
  nombre_poissons_peches: number;
  poids_total_peche: string;
  poids_moyen_poisson: string;
  taille_moyenne?: number;
  etat_sante?: string;
  observations?: string;
  methode_peche?: string;
  date_peche: string;
  bassinId?: number;
  pisciculteurId?: number;
}

export interface ICreatePecheControle {
  nombre_poissons_peches: number;
  poids_total_peche: number;
  poids_moyen_poisson: number;
  taille_moyenne?: number;
  etat_sante?: string;
  observations?: string;
  methode_peche?: string;
}

// Types pour le calendrier de récolte
export interface ICalendrierRecolte {
  id: number;
  date_recolte_prevue: string;
  quantite_prevue: number;
  type_poisson: string;
  observations?: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  date_creation: string;
  bassinId?: number;
}

export interface ICreateCalendrierRecolte {
  date_recolte_prevue: string;
  quantite_prevue: number;
  type_poisson: string;
  observations?: string;
}

// Types pour le calendrier d'avance sur intrants
export interface ICalendrierIntrants {
  id: number;
  date_avance_prevue: string;
  montant_avance: number;
  type_intrant: string;
  quantite_intrant: number;
  observations?: string;
  statut: 'PLANIFIE' | 'APPROUVE' | 'DELIVRE' | 'ANNULE';
  date_creation: string;
  bassinId?: number;
}

export interface ICreateCalendrierIntrants {
  date_avance_prevue: string;
  montant_avance: number;
  type_intrant: string;
  quantite_intrant: number;
  observations?: string;
}

// Types pour les statistiques
export interface IBassinStats {
  total_bassins: number;
  bassins_actifs: number;
  bassins_inactifs: number;
  bassins_maintenance: number;
  bassins_assignes: number;
  bassins_non_assignes: number;
  superficie_totale: number;
  repartition_par_region: {
    region: string;
    nombre_bassins: number;
  }[];
}

export interface IPerformanceStats {
  nombre_mesures: number;
  poids_moyen_total: number;
  taux_mortalite_moyen: number;
  taux_croissance_moyen: number;
  evolution_poissons: {
    date: string;
    nombre_poissons: number;
  }[];
}

export interface IPecheControleStats {
  nombre_peches: number;
  poids_moyen_total: number;
  taille_moyenne_totale: number;
  etat_sante_repartition: Record<string, number>;
  evolution_poids: {
    date: string;
    poids_moyen: number;
  }[];
} 