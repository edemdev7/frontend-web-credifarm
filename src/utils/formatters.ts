import { isSuperAdmin } from "../api/services/admin/adminService";

/**
 * Capitalise une chaîne de caractères.
 *
 * @param input - La chaîne à capitaliser.
 * @param capitalizeAll - Si true, capitalise chaque mot. Sinon, capitalise seulement le premier mot (par défaut false).
 * @returns La chaîne capitalisée.
 */
export const capitalize = (
  input: string,
  capitalizeAll: boolean = false
): string => {
  if (!input || typeof input !== "string") {
    throw new Error("Input must be a non-empty string.");
  }

  if (capitalizeAll) {
    // Capitalise chaque mot
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Capitalise uniquement le premier mot
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

/**
 * Construit une URL avec des paramètres de requête.
 *
 * @param baseUrl - L'URL de base sans les paramètres de requête.
 * @param params - Un objet représentant les paramètres de requête sous forme clé/valeur.
 *                 Les valeurs peuvent être de type string, number ou boolean.
 * @returns Une URL complète incluant les paramètres de requête encodés.
 *
 * @example
 * const url = buildUrl("/api/users", { page: 1, limit: 10, active: true });
 * // Résultat : "/api/users?page=1&limit=10&active=true"
 */
export const buildUrl = (
  baseUrl: string,
  params?: Record<string, string | number | boolean>
): string => {
  if (!params) return baseUrl;
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return `${baseUrl}?${queryString}`;
};

/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "EN_ATTENTE", "VERIFIE", "LISTE_NOIRE").
 * @returns Une version lisible du statut (par exemple "En attente", "Vérifié", "Liste noire").
 */
export const formatRetailerStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    EN_ATTENTE: "En attente",
    VERIFIE: "Vérifié",
    LISTE_NOIRE: "Liste noire",
  };

  return statusMap[status] || "Statut inconnu";
};
/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "EN_ATTENTE", "VERIFIE", "LISTE_NOIRE").
 * @returns Une version lisible du statut (par exemple "En attente", "Vérifié", "Liste noire").
 */
export const formatSupplierStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    EN_ATTENTE: "En attente",
    VERIFIE: "Vérifié",
    LISTE_NOIRE: "Liste noire",
  };

  return statusMap[status] || "Statut inconnu";
};

/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "INIT", "PENDING", "PAYED", "FAILED").
 * @returns Une version lisible du statut (par exemple "Initialisé", "En attente", "Payé", "Échoué").
 */
export const formatDisbursementStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    INIT: "Initialisé",
    PENDING: "En attente",
    PAYED: "Payé",
    FAILED: "Échoué",
  };

  return statusMap[status] || "Statut inconnu";
};

/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "PENDING", "DISBURSE", "OVERPAID", "CLOSE").
 * @returns Une version lisible du statut (par exemple "Active", "En cours", "Trop payé", "Clôturée").
 */
export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Active",
    DISBURSE: "En cours",
    OVERPAID: "Trop payé",
    CLOSE: "Clôturée",
  };

  return statusMap[status] || "Statut inconnu";
};


/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "PENDING", "DISBURSE", "OVERPAID", "CLOSE").
 * @returns Une version lisible du statut (par exemple "Active", "En cours", "Trop payé", "Clôturée").
 */
export const formatLoanStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Accepté",
    REJECTED: "Refusé",
    PAID: "Remboursé",
    EVALUATED: "Evalué"
  };

  return statusMap[status] || "Statut inconnu";
};

export const formatAdminRole = (isSuperAdmin: boolean): string => {
  return isSuperAdmin ? "Super administrateur" : "Administrateur";
};



/**
 * Formate un statut technique en une version lisible pour l'utilisateur.
 *
 * @param status - Le statut technique à formater (par exemple "PENDING", "DISBURSE", "OVERPAID", "CLOSE").
 * @returns Une version lisible du statut (par exemple "Active", "En cours", "Trop payé", "Clôturée").
 */
export const formatMembershipRequestStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "En attente",
    // ACCEPTED: "Approuvé",
    REJECTED: "Refusé",
  };

  return statusMap[status] || "Statut inconnu";
};



/**
 * Formate une chaîne de date en format français (JJ/MM/AAAA).
 *
 * @param dateString - La chaîne de date à formater.
 * @returns La date formatée au format JJ/MM/AAAA.
 *
 * @example
 * const date = formatDate("2023-12-25");
 * // Résultat : "25/12/2023"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
