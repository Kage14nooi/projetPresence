import React, { useState } from "react";
import { Edit2, Trash2, Search, GraduationCap } from "lucide-react";

interface NiveauListProps {
  niveau: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

const NiveauList: React.FC<NiveauListProps> = ({
  niveau = [],
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const niveauCount = niveau.length;

  const getFilteredNiveau = () => {
    if (!searchTerm) return niveau;
    const searchLower = searchTerm.toLowerCase();
    return niveau.filter((n) =>
      n.niveau_nom?.toLowerCase().includes(searchLower)
    );
  };

  const filteredNiveau = getFilteredNiveau();
  const totalPages = Math.ceil(filteredNiveau.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNiveau = filteredNiveau.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Liste des Niveaux</h2>
            <p className="text-blue-100 text-sm">
              {filteredNiveau.length} niveau
              {filteredNiveau.length > 1 ? "x" : ""}
              {searchTerm &&
                ` (filtré${
                  filteredNiveau.length > 1 ? "x" : ""
                } sur ${niveauCount})`}
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom de niveau..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b-2 border-indigo-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nom du Niveau
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentNiveau.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-12 text-center text-gray-500">
                    {searchTerm
                      ? "Aucun résultat trouvé"
                      : "Aucun niveau trouvé"}
                  </td>
                </tr>
              ) : (
                currentNiveau.map((n) => (
                  <tr
                    key={n.niveau_id}
                    className="transition-all duration-200 hover:bg-blue-50"
                  >
                    <td className="px-6 py-4">{n.niveau_nom}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(n)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 />
                      </button>
                      <button
                        onClick={() => onDelete(n.niveau_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredNiveau.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Affichage {startIndex + 1} à{" "}
              {Math.min(endIndex, filteredNiveau.length)} sur{" "}
              {filteredNiveau.length}
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

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<"}
            </button>

            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(num as number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === num
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {num}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NiveauList;
