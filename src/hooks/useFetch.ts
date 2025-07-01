import { useCallback, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useFetch = <TData, TBody = undefined>(
  url: string,
  method: "get" | "post" | "patch" | "delete" = "get"
) => {
  const [data, setData] = useState<TData | null>(null); // Stocke les données de la réponse
  const [loading, setLoading] = useState<boolean>(false); // Indicateur de chargement
  const [error, setError] = useState<string | null>(null); // Message d'erreur si besoin

  const fetchData = useCallback(
    async (body?: TBody) => {
      setLoading(true); // Démarre le chargement
      setError(null); // Réinitialise l'erreur
      try {
        let response;
        // Effectuer la requête en fonction de la méthode
        switch (method) {
          case "get":
            response = await axiosInstance.get<TData>(url);
            break;
          case "post":
            response = await axiosInstance.post<TData>(url, body);
            break;
          case "patch":
            response = await axiosInstance.patch<TData>(url, body);
            break;
          case "delete":
            response = await axiosInstance.delete<TData>(url);
            break;
          default:
            throw new Error("Méthode non supportée");
        }
        setData(response.data); // Stocke les données récupérées
        return response.data;
      } catch (err) {
        if (err instanceof Error) {
          setError(`Une erreur est survenue: ${err.message}`);
        } else {
          setError("Une erreur inconnue est survenue"); // Au cas où l'exception n'est pas un objet Error
        }
      } finally {
        setLoading(false); // Arrête le chargement
      }
    },
    [method, url]
  );

  return { data, loading, error, fetchData }; // Retourne l'état de la requête
};
