import React, { useState } from "react";
import PresenceListSeances from "../composants/Presence/PresenceListSceances";
import PresenceFiche from "../composants/Presence/PresenceFiche";
import type { Seance } from "../types/types";
import { ClipboardCheck, ArrowLeft } from "lucide-react";

const PresencePage: React.FC = () => {
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);

  return (
    <div className="h-screen h-full w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* En-tête de la page */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
                <ClipboardCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestion des Présences
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSeance
                    ? `Fiche de présence Seance - ${
                        selectedSeance.matiere?.matiere_nom || "Séance"
                      }`
                    : "Sélectionnez une séance pour marquer les présences"}
                </p>
              </div>
            </div>

            {selectedSeance && (
              <button
                onClick={() => setSelectedSeance(null)}
                className="group flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Retour aux séances</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteneur principal */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="h-full">
          {!selectedSeance ? (
            <PresenceListSeances onSelectSeance={setSelectedSeance} />
          ) : (
            <PresenceFiche seance={selectedSeance} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PresencePage;
