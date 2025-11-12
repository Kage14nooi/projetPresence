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

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Vérifie si token existe

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
