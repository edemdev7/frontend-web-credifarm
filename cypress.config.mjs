import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    // Spécifie le répertoire des tests e2e
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // URL de base pour les tests
    baseUrl: "http://localhost:5173",

    // Configuration des captures d'écran et vidéos
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",

    // Support pour les fichiers setup globaux
    setupNodeEvents(on, config) {
      // Ajoute ici des plugins ou événements personnalisés
      return config;
    },
  },
});
