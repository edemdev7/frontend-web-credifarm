import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://180.149.197.231",
  timeout: 30000, // Timeout en millisecondes
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Ne pas ajouter le token pour la connexion
    if (config.url?.includes("/auth/login")) {
      return config;
    }
    // Ajouter le token si présent
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] =
        config.data instanceof FormData
          ? "multipart/form-data"
          : "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;
