import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  PlayCircle,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// Connexion Socket.io
const socket = io("http://localhost:3001");

interface SeanceListProps {
  seances: any[];
  onEdit: (s: any) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => Promise<void>;
}

const SeanceList: React.FC<SeanceListProps> = ({
  seances,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const navigate = useNavigate();
  const [localSeances, setLocalSeances] = useState(seances);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialisation locale avec locked si séance terminée
  useEffect(() => {
    const sorted = seances
      .map((s) => ({
        ...s,
        locked:
          s.heure_fin &&
          new Date(`${s.date_seance} ${s.heure_fin}`) < new Date(),
      }))
      .sort(
        (a, b) =>
          new Date(`${b.date_seance} ${b.heure_debut}`).getTime() -
          new Date(`${a.date_seance} ${a.heure_debut}`).getTime()
      );
    setLocalSeances(sorted);
  }, [seances]);

  useEffect(() => {
    const handleSeanceUpdate = (updatedSeance: any) => {
      setLocalSeances((prev) =>
        prev.map((s) => {
          if (s.seance_id !== updatedSeance.seance_id) return s;
          const locked =
            s.locked ||
            (s.heure_fin &&
              new Date(`${s.date_seance} ${s.heure_fin}`) < new Date());
          return {
            ...s,
            is_active: locked ? s.is_active : updatedSeance.is_active,
            locked,
          };
        })
      );
    };

    socket.on("seance_auto_update", handleSeanceUpdate);
    return () => {
      socket.off("seance_auto_update", handleSeanceUpdate);
    };
  }, []);

  // Toggle séance
  const handleToggle = async (s: any) => {
    if (s.locked) {
      alert("Cette séance est déjà terminée.");
      return;
    }
    const wasActive = s.is_active;
    await onToggleActive(s.seance_id);
    if (!wasActive) navigate("/presence");
  };

  // Badge de statut
  const getStatusBadge = (s: any) => {
    if (s.locked) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Terminée
        </span>
      );
    }
    if (s.is_active) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 animate-pulse">
          <PlayCircle className="w-3 h-3 mr-1" />
          En cours
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />À venir
      </span>
    );
  };

  // Filtrage
  const filteredSeances = localSeances.filter((s) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      s.matiere?.matiere_nom?.toLowerCase().includes(lower) ||
      s.date_seance?.toLowerCase().includes(lower) ||
      s.heure_debut?.toLowerCase().includes(lower) ||
      s.heure_fin?.toLowerCase().includes(lower)
    );
  });

  // Statistiques
  const stats = {
    total: filteredSeances.length,
    enCours: filteredSeances.filter((s) => s.is_active && !s.locked).length,
    aVenir: filteredSeances.filter((s) => !s.locked && !s.is_active).length,
    terminees: filteredSeances.filter((s) => s.locked).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredSeances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSeances = filteredSeances.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
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
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* En-tête avec style unifié */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Liste des Séances
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredSeances.length} séance
                {filteredSeances.length > 1 ? "s" : ""}{" "}
                {searchTerm &&
                  `(filtré${filteredSeances.length > 1 ? "es" : "e"} sur ${
                    localSeances.length
                  })`}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques en cartes blanches */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.total}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">En Cours</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.enCours}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">À Venir</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.aVenir}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Terminées</p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats.terminees}
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par matière, date, horaire..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table avec style unifié */}
      <div className="flex-1 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Horaire
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSeances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm
                          ? "Aucun résultat trouvé"
                          : "Aucune séance trouvée"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Essayez avec d'autres mots-clés"
                          : "Commencez par créer une séance"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentSeances.map((s, i) => (
                  <tr
                    key={s.seance_id}
                    className={`transition-all duration-200 ${
                      s.locked
                        ? "bg-gray-100/50 opacity-70"
                        : `hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {s.matiere?.matiere_nom || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {s.date_seance}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm text-gray-600">
                          {s.heure_debut} - {s.heure_fin}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(s)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(s)}
                        disabled={s.locked}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all shadow-sm ${
                          s.locked
                            ? "bg-gray-300 cursor-not-allowed"
                            : s.is_active
                            ? "bg-green-500 shadow-green-200"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        title={
                          s.locked
                            ? "Séance terminée"
                            : s.is_active
                            ? "Désactiver la séance"
                            : "Activer la séance"
                        }
                      >
                        <span
                          className={`inline-block h-5 w-5 transform bg-white rounded-full transition-transform shadow-md ${
                            s.locked || !s.is_active
                              ? "translate-x-1"
                              : "translate-x-6"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => !s.locked && onEdit(s)}
                          disabled={s.locked}
                          className={`group relative p-2 rounded-lg transition-all duration-200 shadow-sm ${
                            s.locked
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-md"
                          }`}
                          title={s.locked ? "Séance terminée" : "Modifier"}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => !s.locked && onDelete(s.seance_id)}
                          disabled={s.locked}
                          className={`group relative p-2 rounded-lg transition-all duration-200 shadow-sm ${
                            s.locked
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-white hover:bg-red-600 hover:shadow-md"
                          }`}
                          title={s.locked ? "Séance terminée" : "Supprimer"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination avec style unifié */}
      {filteredSeances.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Affichage de{" "}
                <span className="font-semibold text-indigo-600">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-indigo-600">
                  {Math.min(endIndex, filteredSeances.length)}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredSeances.length}
                </span>{" "}
                séance{filteredSeances.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Par page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Première page"
              >
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-1 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum as number)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Dernière page"
              >
                <ChevronsRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeanceList;
