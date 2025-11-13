import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal"; // ← Import ajouté
import "./index.css";
import App from "./App.tsx";

// Définir l'élément principal de l'app pour react-modal
Modal.setAppElement("#root");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
