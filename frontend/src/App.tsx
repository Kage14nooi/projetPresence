import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./composants/Layout/Layout";
import Dashboard from "./composants/Dashboard/Dashboard";
import EtudiantPage from "./pages/EtudiantPage";
import ProfesseurPage from "./pages/ProfesseurPage"; // ← Import ajouté
import MatierePage from "./pages/MatierePage";
import { AuthSystem } from "./composants/authentification/auth-system";
import ParcoursPage from "./pages/ParcourPage";
import NiveauPage from "./pages/Niveaupage";
import MentionPage from "./pages/MentionPage";
import PresencePage from "./pages/PresencePage";
import SeancePage from "./pages/SeancePage";
import AbsenceNotification from "./pages/NotificationPage";

import PiecePage from "./pages/PiecePage";
import AbsencePage from "./pages/AbsencePage";
import PiecePage from "./pages/PiecePage";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Vérifie si token existe
  // const isAuthenticated = true; // Vérifie si token existe

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* / et /login affichent le login si pas connecté */}
          <Route path="/" element={<AuthSystem />} />
          <Route path="/login" element={<AuthSystem />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/etudiants"
            element={
              isAuthenticated ? (
                <Layout>
                  <EtudiantPage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/professeurs"
            element={
              isAuthenticated ? (
                <Layout>
                  <ProfesseurPage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/matieres"
            element={
              isAuthenticated ? (
                <Layout>
                  <MatierePage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/parcours"
            element={
              isAuthenticated ? (
                <Layout>
                  <ParcoursPage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/niveau"
            element={
              isAuthenticated ? (
                <Layout>
                  <NiveauPage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/mention"
            element={
              isAuthenticated ? (
                <Layout>
                  <MentionPage />
                </Layout>
              ) : (
                <Navigate to="/mention" />
              )
            }
          />
          <Route
            path="/presence"
            element={
              isAuthenticated ? (
                <Layout>
                  <PresencePage />
                </Layout>
              ) : (
                <Navigate to="/presence" />
              )
            }
          />
          <Route
            path="/justificatifs"
            element={
              isAuthenticated ? (
                <Layout>
                  <PiecePage />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/seance"
            element={
              isAuthenticated ? (
                <Layout>
                  <SeancePage />
                </Layout>
              ) : (
                <Navigate to="/seance" />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated ? (
                <Layout>
                  <AbsenceNotification />
                </Layout>
              ) : (
                <Navigate to="/notifications" />
              )
            }
          />
          <Route
            path="/absences"
            element={
              isAuthenticated ? (
                <Layout>
                  <AbsencePage />
                </Layout>
              ) : (
                <Navigate to="/absences" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
