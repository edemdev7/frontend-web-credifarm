export interface IActivity {
  id: number;
  type: ActivityType;
  description: string;
  donnees?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  date_activite: string;
  pisciculteurId: number;
  pisciculteur: {
    id: number;
    username: string;
    email: string;
    nom: string;
    prenom: string;
    telephone: string;
    status: string;
  };
}

export type ActivityType = 
  | 'connexion'
  | 'creation_bassin'
  | 'ajout_poisson'
  | 'distribution_aliment'
  | 'diagnostic_maladie'
  | 'traitement'
  | 'mesure_eau'
  | 'maintenance_equipement'
  | 'recolte'
  | 'vente'
  | 'autre';

export interface IActivityStats {
  type: ActivityType;
  count: string;
}

export interface IActivityResponse {
  activites: IActivity[];
  total: number;
}

export interface IActivityFilters {
  type?: ActivityType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const ACTIVITY_TYPES: { value: ActivityType; label: string; color: string }[] = [
  { value: 'connexion', label: 'Connexion', color: 'primary' },
  { value: 'creation_bassin', label: 'Création de bassin', color: 'success' },
  { value: 'ajout_poisson', label: 'Ajout de poisson', color: 'secondary' },
  { value: 'distribution_aliment', label: 'Distribution d\'aliment', color: 'warning' },
  { value: 'diagnostic_maladie', label: 'Diagnostic de maladie', color: 'danger' },
  { value: 'traitement', label: 'Traitement', color: 'danger' },
  { value: 'mesure_eau', label: 'Mesure d\'eau', color: 'primary' },
  { value: 'maintenance_equipement', label: 'Maintenance d\'équipement', color: 'warning' },
  { value: 'recolte', label: 'Récolte', color: 'success' },
  { value: 'vente', label: 'Vente', color: 'success' },
  { value: 'autre', label: 'Autre', color: 'default' }
];

export const getActivityTypeLabel = (type: ActivityType): string => {
  return ACTIVITY_TYPES.find(t => t.value === type)?.label || type;
};

export const getActivityTypeColor = (type: ActivityType): string => {
  return ACTIVITY_TYPES.find(t => t.value === type)?.color || 'default';
}; 