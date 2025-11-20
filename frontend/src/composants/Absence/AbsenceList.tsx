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
  ChevronsLeft,
  ChevronsRight,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
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

  const attente = filteredAbsences.filter((a) =>
    a.justification_status.toLowerCase().includes("attente")
  ).length;

  const total = filteredAbsences.length;
  const justifiees = total - attente;

  const stats = {
    total,
    justifiees,
    enAttente: attente,
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
    <div className="flex flex-col min-h-full">
      {/* En-tête avec style unifié */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Gestion des Absences
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredAbsences.length} absence
                {filteredAbsences.length > 1 ? "s" : ""}{" "}
                {searchTerm &&
                  `(filtré${filteredAbsences.length > 1 ? "es" : "e"} sur ${
                    absences.length
                  })`}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques en cartes blanches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.total}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3">
                <AlertCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Justifiées</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.justifiees}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.enAttente}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule, matière, statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>

        {/* Toggle filtres */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-white hover:text-blue-100 font-medium transition-colors"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </button>

        {/* Filtres déroulants */}
        {showFilters && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mt-4 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                  <option value="">Toutes les matières</option>
                  {matiereOptions.map((m) => (
                    <option key={m} value={m}>
                      {
                        absences.find((a) => a.seance.matiere_id === m)?.seance
                          .matiere.matiere_nom
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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

      {/* Table avec style unifié */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
              <tr>
                {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Étudiant
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Séance
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Justification
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pièces
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentAbsences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm
                          ? "Aucun résultat trouvé"
                          : "Aucune absence trouvée"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Essayez avec d'autres mots-clés"
                          : "Les absences apparaîtront ici"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentAbsences.map((a, i) => (
                  <tr
                    key={a.absence_id}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        #{a.absence_id}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="w-24 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {a.etudiant.etudiant_matricule.substring(0, 10)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                          {a.etudiant.etudiant_prenom[0]}
                          {a.etudiant.etudiant_nom[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {a.etudiant.etudiant_nom}{" "}
                            {a.etudiant.etudiant_prenom}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">
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
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatutBadge(
                          a.statut
                        )}`}
                      >
                        {a.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getJustificationBadge(
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
                              <FileText className="w-4 h-4 text-indigo-500" />
                              <span className="text-xs text-gray-600 truncate max-w-[150px]">
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
      </div>

      {/* Pagination avec style unifié */}
      {filteredAbsences.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Affichage de{" "}
                <span className="font-semibold text-indigo-600">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-indigo-600">
                  {Math.min(endIndex, filteredAbsences.length)}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredAbsences.length}
                </span>{" "}
                absence{filteredAbsences.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Par page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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

export default AbsenceList;
