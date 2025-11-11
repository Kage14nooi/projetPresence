// // src/App.tsx
// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Layout from "./composants/Layout/Layout";
// import Dashboard from "./composants/Dashboard/Dashboard";
// import EtudiantPage from "./pages/EtudiantPage";
// import { AuthSystem } from "./composants/authentification/auth-system";

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gra@y-100">
//         <Routes>
//           {/* Page de connexion */}
//           <Route path="/login" element={<AuthSystem />} />

//           {/* Layout commun à toutes les pages protégées */}
//           <Route
//             path="/dashboard"
//             element={
//               <Layout>
//                 <Dashboard />
//               </Layout>
//             }
//           />
//           <Route
//             path="/etudiants"
//             element={
//               <Layout>
//                 <EtudiantPage />
//               </Layout>
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.tsx
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
import { AuthSystem } from "./composants/authentification/auth-system";

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

          {/* Redirige toutes les autres URLs vers login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
