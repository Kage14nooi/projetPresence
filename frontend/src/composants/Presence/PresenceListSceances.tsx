import React, { useEffect, useState } from "react";
import type { Seance } from "../../types/types";
import { presenceService } from "../../services/PresenceService";

interface ListeSeancesProps {
  onSelectSeance: (seance: Seance) => void;
}

const PresenceListSeances: React.FC<ListeSeancesProps> = ({
  onSelectSeance,
}) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const data = await presenceService.getAllSeances();
        console.log("Seances récupérées :", data);
        setSeances(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeances();
  }, []);

  if (loading) return <p>Chargement des séances...</p>;
  if (!seances.length) return <p>Aucune séance trouvée.</p>;

  return (
    <div className="space-y-2">
      {seances.map((s) => (
        <div
          key={s.seance_id}
          className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 cursor-pointer flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Date :</strong> {s.date_seance}
            </p>
            <p>
              <strong>Heure :</strong> {s.heure_debut} - {s.heure_fin}
            </p>
          </div>
          <button
            onClick={() => onSelectSeance(s)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Voir fiche
          </button>
        </div>
      ))}
    </div>
  );
};

export default PresenceListSeances;
