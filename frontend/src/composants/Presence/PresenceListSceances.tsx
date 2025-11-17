import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpen,
  School,
  GraduationCap,
  Layers3,
  ArrowRight,
} from "lucide-react";
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
        setSeances(data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeances();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Chargement des séances...</p>
      </div>
    );

  if (!seances.length)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400">Aucune séance trouvée.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {seances.map((s) => (
        <div
          key={s.seance_id}
          className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            {/* LEFT CONTENT */}
            <div className="flex flex-col gap-3">
              {/* ✳️ Titre Matière */}
              <div className="flex items-center text-xl font-semibold text-blue-700">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                {s.matiere?.matiere_nom}
              </div>

              {/* 🏫 Mention */}
              <div className="flex items-center text-gray-600 text-sm">
                <School className="w-4 h-4 mr-2 text-purple-500" />
                <span className="font-medium">Mention :</span>
                <span className="ml-1">{s.matiere?.mention?.mention_nom}</span>
              </div>

              {/* 🔷 Parcours */}
              <div className="flex items-center text-gray-600 text-sm">
                <Layers3 className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="font-medium">Parcours :</span>
                <span className="ml-1">{s.matiere?.parcour?.parcours_nom}</span>
              </div>

              {/* 🎓 Niveau */}
              <div className="flex items-center text-gray-600 text-sm">
                <GraduationCap className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium">Niveau :</span>
                <span className="ml-1">{s.matiere?.niveau?.niveau_nom}</span>
              </div>

              {/* 📅 Date */}
              <div className="flex items-center text-gray-600 text-sm">
                <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                {new Date(s.date_seance).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* 🕒 Heure */}
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {s.heure_debut} → {s.heure_fin}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => onSelectSeance(s)}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-medium rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200"
            >
              Voir fiche
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PresenceListSeances;
