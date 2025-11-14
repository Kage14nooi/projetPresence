import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
} from "lucide-react";

import type { PieceJustificative } from "../../types/types";
interface AbsenceListProps {
  absences: any[];
  onEdit: (absence: any) => void;
  onDelete: (id: number) => void;
}

const AbsenceList: React.FC<AbsenceListProps> = ({
  absences = [],
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const absencesCount = absences?.length || 0;

  const getFilteredAbsences = () => {
    if (!searchTerm) return absences;

    const searchLower = searchTerm.toLowerCase();
    return absences.filter((a) => {
      const e = a.etudiant;
      const s = a.seance;
      const matiere = s?.matiere;
      return (
        e.etudiant_nom?.toLowerCase().includes(searchLower) ||
        e.etudiant_prenom?.toLowerCase().includes(searchLower) ||
        e.etudiant_matricule?.toLowerCase().includes(searchLower) ||
        matiere?.matiere_nom?.toLowerCase().includes(searchLower) ||
        a.statut?.toLowerCase().includes(searchLower) ||
        a.justification_status?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredAbsences = getFilteredAbsences();

  // Pagination
  const totalPages = Math.ceil(filteredAbsences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbsences = filteredAbsences.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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
      {/* En-tête */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Liste des Absences</h2>
          <p className="text-white text-sm">
            {filteredAbsences.length} absence
            {filteredAbsences.length > 1 ? "s" : ""}{" "}
            {searchTerm &&
              `(filtré sur ${filteredAbsences.length} sur ${absencesCount})`}
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par étudiant, matricule, matière, statut..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100 border-b-2 border-red-300 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Séance / Matière
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pièces justificatifs
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Désciption du justificatifs
                </th>
                {/* <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentAbsences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    Aucun absence trouvé
                  </td>
                </tr>
              ) : (
                currentAbsences.map((a) => (
                  <tr
                    key={a.absence_id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4">{a.absence_id}</td>
                    <td className="px-6 py-4">
                      {a.etudiant.etudiant_nom} {a.etudiant.etudiant_prenom}
                    </td>
                    <td className="px-6 py-4">
                      {a.etudiant.etudiant_matricule}
                    </td>
                    <td className="px-6 py-4">
                      {a.seance.date_seance} - {a.seance.matiere.matiere_nom} (
                      {a.seance.heure_debut} à {a.seance.heure_fin})
                    </td>
                    <td className="px-6 py-4">{a.statut}</td>
                    <td className="px-6 py-4">{a.justification_status}</td>
                    <td className="px-6 py-4">
                      {a.pieces.length > 0 ? (
                        a.pieces.map((p: PieceJustificative) => (
                          <div
                            key={p.pieceJust_id}
                            className="flex items-center space-x-1"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">
                              {p.pieceJust_description}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Aucune</span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEdit(a)}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(a.absence_id)}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredAbsences.length > 0 && (
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600">
              Affichage de {startIndex + 1} à{" "}
              {Math.min(endIndex, filteredAbsences.length)} sur{" "}
              {filteredAbsences.length}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span key={idx} className="px-2">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(num as number)}
                  className={`px-2 ${currentPage === num ? "font-bold" : ""}`}
                >
                  {num}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsenceList;
