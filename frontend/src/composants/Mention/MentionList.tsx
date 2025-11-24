import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Search,
  Award,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const mentionCount = mention.length;

  // Filtrage
  const filtered = mention.filter((m) =>
    m.mention_nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: any[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* <div className="max-w-7xl mx-auto w-full flex flex-col h-full"> */}
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden flex-shrink-0">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Mentions</h1>
                <p className="text-blue-100">
                  {filtered.length} mention{filtered.length > 1 ? "s" : ""}{" "}
                  {searchTerm && `sur ${mentionCount} au total`}
                </p>
              </div>
            </div>

            {/* Toggle View */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une mention..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border-2 border-transparent 
                focus:border-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all
                text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {currentData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune mention trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <>
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {currentData.map((m, i) => (
                <div
                  key={m.mention_id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl 
                    transition-all duration-300 overflow-hidden border-2 border-transparent
                    hover:border-indigo-200 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 h-3"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-3">
                        <Award className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                      {m.mention_nom}
                    </h3>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => onEdit(m)}
                        className="flex-1 flex items-center justify-center  px-4 py-2.5 
                          bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white
                          transition-all duration-200 font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(m.mention_id)}
                        className="flex-1 flex items-center justify-center px-4 py-2.5 
                          bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white
                          transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="divide-y divide-gray-100">
                {currentData.map((m, i) => (
                  <div
                    key={m.mention_id}
                    className="group flex items-center justify-between p-6 hover:bg-gradient-to-r 
                      hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    style={{
                      animation: `fadeInUp 0.3s ease-out ${i * 0.03}s both`,
                    }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-3">
                        <Award className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {m.mention_nom}
                        </h3>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(m)}
                        className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 
                          rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(m.mention_id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 
                          rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGINATION */}
          {filtered.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 flex-shrink-0">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  Affichage de{" "}
                  <span className="font-semibold text-indigo-600">
                    {startIndex + 1}
                  </span>{" "}
                  à{" "}
                  <span className="font-semibold text-indigo-600">
                    {Math.min(startIndex + itemsPerPage, filtered.length)}
                  </span>{" "}
                  sur{" "}
                  <span className="font-semibold text-indigo-600">
                    {filtered.length}
                  </span>{" "}
                  mentions
                </p>

                <div className="flex items-center gap-3">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      handleItemsPerPageChange(Number(e.target.value));
                    }}
                    className="px-4 py-2 border-2 border-gray-200 bg-white rounded-lg
                      focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-gray-600 
                        rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronsLeft className="w-5 h-5" />
                    </button>

                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-2 bg-white border-2 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-gray-600 
                        rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {getPageNumbers().map((num, idx) =>
                      num === "…" || num === "..." ? (
                        <span
                          key={idx}
                          className="px-3 flex items-center text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(num)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            currentPage === num
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent"
                              : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-gray-600 
                        rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-gray-600 
                        rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronsRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* </div> */}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Demo avec données d'exemple
export default MentionList;
