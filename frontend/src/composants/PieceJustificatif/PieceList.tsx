import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  FileText,
  Search,
  FolderOpen,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Piece {
  pieceJust_id: number;
  motif: "Maladie" | "Evénement familial" | "Autres";
  pieceJust_file?: string;
  pieceJust_description?: string;
  absence?: {
    absence_id: number;
    etudiant?: {
      etudiant_nom: string;
      etudiant_prenom: string;
      etudiant_matricule: string;
    };
    seance?: {
      matiere?: {
        matiere_nom: string;
      };
    };
  };
}

interface PieceListProps {
  pieces: Piece[];
  onEdit: (piece: Piece) => void;
  onDelete: (id: number) => void;
}

const PieceList: React.FC<PieceListProps> = ({ pieces, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage
  const filteredPieces = pieces.filter((piece) => {
    const lower = searchTerm.toLowerCase();
    return (
      piece.motif.toLowerCase().includes(lower) ||
      piece.pieceJust_description?.toLowerCase().includes(lower) ||
      piece.absence?.etudiant?.etudiant_nom.toLowerCase().includes(lower) ||
      piece.absence?.etudiant?.etudiant_prenom.toLowerCase().includes(lower) ||
      piece.absence?.etudiant?.etudiant_matricule
        .toLowerCase()
        .includes(lower) ||
      piece.absence?.seance?.matiere?.matiere_nom?.toLowerCase().includes(lower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPieces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPieces = filteredPieces.slice(startIndex, endIndex);

  const getMotifBadge = (motif: string) => {
    switch (motif) {
      case "Maladie":
        return "bg-red-100 text-red-700 border-red-200";
      case "Evénement familial":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Autres":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
      {/* En-tête et recherche */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Liste des Pièces Justificatives
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredPieces.length} pièce
                {filteredPieces.length > 1 ? "s" : ""}{" "}
                {searchTerm &&
                  `(filtré${filteredPieces.length > 1 ? "es" : "e"} sur ${
                    pieces.length
                  })`}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par étudiant, matricule, matière, motif, description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
              <tr>
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
                  Motif
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentPieces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm
                          ? "Aucun résultat trouvé"
                          : "Aucune pièce justificative"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Essayez avec d'autres mots-clés"
                          : "Les pièces justificatives apparaîtront ici"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPieces.map((piece, i) => (
                  <tr
                    key={piece.pieceJust_id}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      {piece.absence?.etudiant?.etudiant_matricule ? (
                        <div className="w-24 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                          {piece.absence.etudiant.etudiant_matricule.substring(
                            0,
                            10
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {piece.absence?.etudiant ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                            {piece.absence.etudiant.etudiant_prenom[0]}
                            {piece.absence.etudiant.etudiant_nom[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {piece.absence.etudiant.etudiant_nom}{" "}
                              {piece.absence.etudiant.etudiant_prenom}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">
                          {piece.absence?.seance?.matiere?.matiere_nom || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getMotifBadge(
                          piece.motif
                        )}`}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {piece.motif}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">
                          {piece.pieceJust_description || (
                            <span className="text-gray-400 italic">
                              Aucune description
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {piece.pieceJust_file ? (
                        <a
                          href={`http://localhost:3001/uploads/${piece.pieceJust_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Voir fichier</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Aucun fichier
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEdit(piece)}
                          className="group relative p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(piece.pieceJust_id)}
                          className="group relative p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Supprimer"
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

      {/* Pagination */}
      {filteredPieces.length > 0 && (
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
                  {Math.min(endIndex, filteredPieces.length)}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredPieces.length}
                </span>{" "}
                pièce{filteredPieces.length > 1 ? "s" : ""}
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

export default PieceList;
