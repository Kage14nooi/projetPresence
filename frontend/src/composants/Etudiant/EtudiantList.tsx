import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

interface EtudiantListProps {
  etudiants: any[];
  onEdit: (etudiant: any) => void;
  onDelete: (id: number) => void;
}

const EtudiantList: React.FC<EtudiantListProps> = ({
  etudiants = [],
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const etudiantsCount = etudiants?.length || 0;

  // Filtrage des étudiants
  const getFilteredEtudiants = () => {
    if (!searchTerm) return etudiants;

    return etudiants.filter((e) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        e.etudiant_nom?.toLowerCase().includes(searchLower) ||
        e.etudiant_prenom?.toLowerCase().includes(searchLower) ||
        e.etudiant_matricule?.toLowerCase().includes(searchLower) ||
        e.etudiant_mail?.toLowerCase().includes(searchLower) ||
        e.etudiant_parcours?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredEtudiants = getFilteredEtudiants();

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand on change le nombre d'items par page
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Réinitialiser à la page 1 quand on recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
      {/* En-tête avec statistiques et recherche */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Liste des Étudiants
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredEtudiants.length} étudiant
                {filteredEtudiants.length > 1 ? "s" : ""}{" "}
                {searchTerm &&
                  `(filtré${
                    filteredEtudiants.length > 1 ? "s" : ""
                  } sur ${etudiantsCount})`}
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule, email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      {/* Conteneur avec défilement */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nom Complet
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Parcours
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEtudiants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm
                          ? "Aucun résultat trouvé"
                          : "Aucun étudiant trouvé"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Essayez avec d'autres mots-clés"
                          : "Commencez par ajouter un étudiant"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentEtudiants.map((e, i) => (
                  <tr
                    key={e.etudiant_id}
                    className={`
                      transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
                      ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-20 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {e.etudiant_matricule?.substring(0, 10) || "??"}
                        </div>
                        {/* <span className="ml-3 font-semibold text-gray-900">
                          {e.etudiant_matricule}
                        </span> */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {e.etudiant_nom} {e.etudiant_prenom}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {e.etudiant_niveau || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {e.etudiant_parcours || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {e.etudiant_mail && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="truncate max-w-[200px]">
                              {e.etudiant_mail}
                            </span>
                          </div>
                        )}
                        {e.etudiant_tel && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-green-500" />
                            <span>{e.etudiant_tel}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEdit(e)}
                          className="group relative p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(e.etudiant_id)}
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

      {/* Pagination moderne */}
      {filteredEtudiants.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between">
            {/* Informations et sélecteur d'items par page */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Affichage de{" "}
                <span className="font-semibold text-indigo-600">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-indigo-600">
                  {Math.min(endIndex, filteredEtudiants.length)}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredEtudiants.length}
                </span>{" "}
                étudiant{filteredEtudiants.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Par page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
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

            {/* Contrôles de pagination */}
            <div className="flex items-center space-x-2">
              {/* Première page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Première page"
              >
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>

              {/* Page précédente */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {/* Numéros de page */}
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
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all
                        ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              {/* Page suivante */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dernière page */}
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

export default EtudiantList;
