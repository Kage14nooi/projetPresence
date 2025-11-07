import { useState } from "react";
import "./App.css";
import { Button } from "./composants/Button";
import { Input } from "./composants/Input";
import { Lock, Mail } from "lucide-react";
import { Text } from "./composants/Text";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>

      <div className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
          Connexion
        </h1>

        <Input
          label="Adresse e-mail"
          icon={Mail}
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Mot de passe"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="primary">Se Connecter</Button>
      </div>
    </>
  );
}

export default App;
