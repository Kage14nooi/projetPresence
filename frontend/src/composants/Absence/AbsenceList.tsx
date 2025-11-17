"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Calendar,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface PieceJustificative {
  pieceJust_id: number;
  pieceJust_description: string;
}

interface Absence {
  absence_id: number;
  statut: string;
  justification_status: string;
  pieces: PieceJustificative[];
  etudiant: {
    etudiant_nom: string;
    etudiant_prenom: string;
    etudiant_matricule: string;
    parcours_id: number;
    niveau_id: number;
  };
  seance: {
    date_seance: string;
    heure_debut: string;
    heure_fin: string;
    matiere_id: number;
    matiere: {
      matiere_nom: string;
    };
  };
}

interface AbsenceListProps {
  absences: Absence[];
  onEdit?: (absence: Absence) => void;
  onDelete?: (id: number) => void;
}

const AbsenceList: React.FC<AbsenceListProps> = ({ absences = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [selectedParcours, setSelectedParcours] = useState<number | "">("");
  const [selectedNiveau, setSelectedNiveau] = useState<number | "">("");
  const [selectedMatiere, setSelectedMatiere] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Options uniques pour les filtres
  const parcoursOptions = Array.from(
    new Set(absences.map((a) => a.etudiant.parcours_id))
  );
  const niveauOptions = Array.from(
    new Set(
      absences
        .filter(
          (a) =>
            !selectedParcours || a.etudiant.parcours_id === selectedParcours
        )
        .map((a) => a.etudiant.niveau_id)
    )
  );
  const matiereOptions = Array.from(
    new Set(
      absences
        .filter(
          (a) =>
            (!selectedParcours ||
              a.etudiant.parcours_id === selectedParcours) &&
            (!selectedNiveau || a.etudiant.niveau_id === selectedNiveau)
        )
        .map((a) => a.seance.matiere_id)
    )
  );
  const dateOptions = Array.from(
    new Set(
      absences
        .filter(
          (a) =>
            (!selectedParcours ||
              a.etudiant.parcours_id === selectedParcours) &&
            (!selectedNiveau || a.etudiant.niveau_id === selectedNiveau) &&
            (!selectedMatiere || a.seance.matiere_id === selectedMatiere)
        )
        .map((a) => a.seance.date_seance)
    )
  );

  // Filtrage des absences
  const filteredAbsences = absences
    .filter(
      (a) => !selectedParcours || a.etudiant.parcours_id === selectedParcours
    )
    .filter((a) => !selectedNiveau || a.etudiant.niveau_id === selectedNiveau)
    .filter((a) => !selectedMatiere || a.seance.matiere_id === selectedMatiere)
    .filter((a) => !selectedDate || a.seance.date_seance === selectedDate)
    .filter((a) => {
      if (!searchTerm) return true;
      const e = a.etudiant;
      const s = a.seance;
      const matiere = s?.matiere;
      const lower = searchTerm.toLowerCase();
      return (
        e.etudiant_nom.toLowerCase().includes(lower) ||
        e.etudiant_prenom.toLowerCase().includes(lower) ||
        e.etudiant_matricule.toLowerCase().includes(lower) ||
        matiere.matiere_nom.toLowerCase().includes(lower) ||
        a.statut.toLowerCase().includes(lower) ||
        a.justification_status.toLowerCase().includes(lower)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.seance.date_seance).getTime() -
        new Date(a.seance.date_seance).getTime()
    );

  // Statistiques
  const stats = {
    total: filteredAbsences.length,
    justifiees: filteredAbsences.filter((a) =>
      a.justification_status.toLowerCase().includes("justif")
    ).length,
    nonJustifiees: filteredAbsences.filter((a) =>
      a.justification_status.toLowerCase().includes("non")
    ).length,
    enAttente: filteredAbsences.filter((a) =>
      a.justification_status.toLowerCase().includes("attente")
    ).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredAbsences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbsences = filteredAbsences.slice(startIndex, endIndex);

  const clearFilters = () => {
    setSelectedParcours("");
    setSelectedNiveau("");
    setSelectedMatiere("");
    setSelectedDate("");
    setSearchTerm("");
  };

  const getStatutBadge = (statut: string) => {
    const lower = statut.toLowerCase();
    if (lower.includes("absent"))
      return "bg-red-100 text-red-700 border-red-200";
    if (lower.includes("présent"))
      return "bg-green-100 text-green-700 border-green-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getJustificationBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("justif") && !lower.includes("non"))
      return "bg-green-100 text-green-700 border-green-200";
    if (lower.includes("non")) return "bg-red-100 text-red-700 border-red-200";
    if (lower.includes("attente"))
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec gradient moderne */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Gestion des Absences
              </h1>
              <p className="text-purple-100">
                Suivi et analyse des présences étudiantes
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-white text-sm font-medium">Total</p>
              <p className="text-4xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          {/* Statistiques en cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Justifiées</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.justifiees}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Non Justifiées</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.nonJustifiees}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">En Attente</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.enAttente}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule, matière, statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Toggle filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </button>

          {/* Filtres déroulants */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Matière
                  </label>
                  <select
                    value={selectedMatiere}
                    onChange={(e) =>
                      setSelectedMatiere(Number(e.target.value) || "")
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="">Toutes les matières</option>
                    {matiereOptions.map((m) => (
                      <option key={m} value={m}>
                        {
                          absences.find((a) => a.seance.matiere_id === m)
                            ?.seance.matiere.matiere_nom
                        }
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Tableau dans une carte */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Étudiant
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Matricule
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Séance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Justification
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Pièces
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentAbsences.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          Aucune absence trouvée
                        </p>
                        <p className="text-sm mt-2">
                          Essayez de modifier vos critères de recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentAbsences.map((a) => (
                    <tr
                      key={a.absence_id}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {a.absence_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {a.etudiant.etudiant_prenom[0]}
                            {a.etudiant.etudiant_nom[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {a.etudiant.etudiant_nom}{" "}
                              {a.etudiant.etudiant_prenom}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-mono">
                          {a.etudiant.etudiant_matricule}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {a.seance.matiere.matiere_nom}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {a.seance.date_seance} • {a.seance.heure_debut} -{" "}
                            {a.seance.heure_fin}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatutBadge(
                            a.statut
                          )}`}
                        >
                          {a.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getJustificationBadge(
                            a.justification_status
                          )}`}
                        >
                          {a.justification_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {a.pieces.length > 0 ? (
                          <div className="space-y-1">
                            {a.pieces.map((p: PieceJustificative) => (
                              <div
                                key={p.pieceJust_id}
                                className="flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4 text-purple-500" />
                                <span className="text-xs text-gray-600">
                                  {p.pieceJust_description}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Aucune pièce
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination moderne */}
          {filteredAbsences.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Affichage de{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredAbsences.length)}
                </span>{" "}
                sur{" "}
                <span className="font-medium text-gray-900">
                  {filteredAbsences.length}
                </span>{" "}
                résultats
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} par page
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbsenceList;
