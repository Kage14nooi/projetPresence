import "./App.css";
import { AuthSystem } from "./composants/authentification/auth-system";
import EtudiantPage from "./pages/EtudiantPage";
function App() {
  return (
    <div className="min-h-screen  bg-gray-100">
      <EtudiantPage />
    </div>
  );
}

export default App;
