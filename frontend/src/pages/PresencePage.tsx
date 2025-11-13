import React, { useState } from "react";
import PresenceListSeances from "../composants/Presence/PresenceListSceances";
import PresenceFiche from "../composants/Presence/PresenceFiche";
import type { Seance } from "../types/types";

const PresencePage: React.FC = () => {
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Gestion des présences</h1>

      {!selectedSeance ? (
        <PresenceListSeances onSelectSeance={setSelectedSeance} />
      ) : (
        <div>
          <button
            onClick={() => setSelectedSeance(null)}
            className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            ← Retour aux séances
          </button>
          <PresenceFiche seance={selectedSeance} />
        </div>
      )}
    </div>
  );
};

export default PresencePage;
