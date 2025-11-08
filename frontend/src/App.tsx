import "./App.css";
import { AuthSystem } from "./composants/authentification/auth-system";
import EtudiantPage from "./pages/EtudiantPage";
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Gestion des Étudiants
      </h1>
      <EtudiantPage />
    </div>
  );
}

export default App;
