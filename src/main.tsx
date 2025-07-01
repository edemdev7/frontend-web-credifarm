import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/styles/index.css";
import "antd/dist/reset.css";
import App from "./App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { I18nProvider } from "@react-aria/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <I18nProvider locale="fr">
        <HelmetProvider>
          <AnimatePresence>
            <App />
          </AnimatePresence>
        </HelmetProvider>
      </I18nProvider>
    </HeroUIProvider>
  </StrictMode>
);
