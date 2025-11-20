import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Award,
} from "lucide-react";

interface MentionListProps {
  mention: any[];
  onEdit: (m: any) => void;
  onDelete: (id: number) => void;
}

const MentionList: React.FC<MentionListProps> = ({
  mention = [],
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mentionCount = mention.length;

  // Filtrage
  const filtered = mention.filter((m) =>
    m.mention_nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(start, start + itemsPerPage);

  const getPageNumbers = () => {
    const pages: any[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      else
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
    return pages;
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Liste des Mentions
              </h2>
              <p className="text-blue-100 text-sm">
                {filtered.length} mention
                {filtered.length > 1 ? "s" : ""}{" "}
                {searchTerm && `(filtré sur ${mentionCount})`}
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une mention..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 
            focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nom du mention
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-12 text-center text-gray-500">
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                currentData.map((m, i) => (
                  <tr
                    key={m.mention_id}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">{m.mention_nom}</td>

                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(m)}
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg 
                        transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Edit2 />
                      </button>
                      <button
                        onClick={() => onDelete(m.mention_id)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg 
                        transition-all duration-200 shadow-sm hover:shadow-md"
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

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between">
            {/* Info */}
            <p className="text-sm text-gray-600">
              Affichage de{" "}
              <span className="font-semibold text-indigo-600">{start + 1}</span>{" "}
              à{" "}
              <span className="font-semibold text-indigo-600">
                {Math.min(start + itemsPerPage, filtered.length)}
              </span>{" "}
              sur{" "}
              <span className="font-semibold text-indigo-600">
                {filtered.length}
              </span>{" "}
              mentions
            </p>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Items per page */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 bg-white rounded-lg"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              {/* First */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronsLeft />
              </button>

              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((num, idx) =>
                num === "…" || num === "..." ? (
                  <span key={idx} className="px-3">
                    ...
                  </span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      currentPage === num
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronRight />
              </button>

              {/* Last */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronsRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentionList;
