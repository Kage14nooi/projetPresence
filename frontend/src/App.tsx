// src/App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./composants/Layout/Layout";
import Dashboard from "./composants/Dashboard/Dashboard";
import EtudiantPage from "./pages/EtudiantPage";
import { AuthSystem } from "./composants/authentification/auth-system";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Page de connexion */}
          <Route path="/login" element={<AuthSystem />} />

          {/* Layout commun à toutes les pages protégées */}
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/etudiants"
            element={
              <Layout>
                <EtudiantPage />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
