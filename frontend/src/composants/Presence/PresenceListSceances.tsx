import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpen,
  School,
  GraduationCap,
  Layers3,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

  // 🔥 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

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

  // 🔥 Gestion pagination
  const totalPages = Math.ceil(seances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSeances = seances.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* LISTE DES SÉANCES */}
      <div className="flex-1 space-y-4">
        {currentSeances.map((s) => (
          <div
            key={s.seance_id}
            className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-3">
                {/* MATIERE + DATE */}
                <div className="flex items-center text-xl font-semibold text-blue-700 flex-wrap gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Séance {s.matiere?.matiere_nom} |
                  <span className="flex items-center text-gray-600 text-sm">
                    <CalendarDays className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(s.date_seance).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mx-2 text-gray-400" />
                    {s.heure_debut} → {s.heure_fin}
                  </span>
                </div>

                {/* MENTION */}
                <div className="flex items-center text-gray-600 text-sm">
                  <School className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="font-medium">Mention :</span>
                  <span className="ml-1">
                    {s.matiere?.mention?.mention_nom}
                  </span>
                </div>

                {/* PARCOURS */}
                <div className="flex items-center text-gray-600 text-sm">
                  <Layers3 className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="font-medium">Parcours :</span>
                  <span className="ml-1">
                    {s.matiere?.parcour?.parcours_nom}
                  </span>
                </div>

                {/* NIVEAU */}
                <div className="flex items-center text-gray-600 text-sm">
                  <GraduationCap className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">Niveau :</span>
                  <span className="ml-1">{s.matiere?.niveau?.niveau_nom}</span>
                </div>
              </div>

              {/* BOUTON */}
              <button
                onClick={() => onSelectSeance(s)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-medium rounded-full shadow-md hover:bg-green-600 hover:shadow-lg"
              >
                Voir fiche
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 PAGINATION COLLÉE EN BAS 🔥 */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl mt-4">
        <div className="flex items-center justify-between">
          {/* Par Page */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Par page :</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg bg-white"
            >
              <option value={4}>4</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Boutons pagination */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded border bg-white disabled:opacity-40"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded border bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* NUMÉROS */}
            {getPageNumbers().map((p, index) =>
              p === "..." ? (
                <span key={index} className="px-3 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded-lg border font-medium ${
                    currentPage === p
                      ? "bg-indigo-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border bg-white disabled:opacity-40"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceListSeances;
