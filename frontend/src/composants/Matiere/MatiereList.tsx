import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  BookOpen,
  User,
  GraduationCap,
  Award,
  Sparkles,
} from "lucide-react";

interface MatiereListProps {
  matieres: any[];
  onEdit: (matiere: any) => void;
  onDelete: (id: number) => void;
}

const MatiereList: React.FC<MatiereListProps> = ({
  matieres = [],
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const matiereCount = matieres?.length || 0;

  // Filtrage
  const filtered = matieres.filter((m) => {
    const s = searchTerm.toLowerCase();
    return (
      m.matiere_nom?.toLowerCase().includes(s) ||
      m.professeur?.professeur_nom?.toLowerCase().includes(s) ||
      m.professeur?.professeur_prenom?.toLowerCase().includes(s) ||
      m.parcour?.parcours_nom?.toLowerCase().includes(s) ||
      m.mention?.mention_nom?.toLowerCase().includes(s) ||
      m.niveau?.niveau_nom?.toLowerCase().includes(s)
    );
  });

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
    <div className="flex flex-col  p-4">
      {/* HEADER */}
      <div className="bg-white h-screen rounded-xl mb-6 overflow-hidden flex-shrink-0">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 relative">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Liste des Matières
                </h1>
                <p className="text-blue-100">
                  {filtered.length} matière{filtered.length > 1 ? "s" : ""}{" "}
                  {searchTerm && `sur ${matiereCount} au total`}
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, professeur, parcours, niveau, mention..."
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
        <div className="flex-1 ">
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-indigo-200 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase tracking-wider">
                    <div className="flex items-left gap-2">
                      <BookOpen className="w-4 h-4 " />
                      Matière
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase tracking-wider">
                    <div className="flex items-left gap-2">
                      <User className="w-4 h-4 " />
                      Professeur
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase tracking-wider">
                    <div className="flex items-left gap-2">
                      <GraduationCap className="w-4 h-4 " />
                      Parcours
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase tracking-wider">
                    <div className="flex items-left gap-2">
                      <Award className="w-4 h-4 " />
                      Niveau
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase tracking-wider">
                    <div className="flex items-left gap-2">
                      <Sparkles className="w-4 h-4 " />
                      Mention
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-bold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                          <BookOpen className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {searchTerm
                            ? "Aucun résultat trouvé"
                            : "Aucune matière trouvée"}
                        </h3>
                        <p className="text-gray-500">
                          {searchTerm
                            ? "Essayez avec d'autres mots-clés"
                            : "Commencez par ajouter une matière"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((m, i) => (
                    <tr
                      key={m.matiere_id}
                      className={`group transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                      style={{
                        animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                      }}
                    >
                      {/* Matière */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 text-base">
                            {m.matiere_nom}
                          </span>
                        </div>
                      </td>
                      {/* Professeur */}
                      <td className="px-6 py-5">
                        {m.professeur ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 ">
                            <User className="w-3.5 h-3.5 text-white" />
                            <span className="text-sm font-medium text-black">
                              {m.professeur.professeur_prenom}{" "}
                              {m.professeur.professeur_nom}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Non défini
                          </span>
                        )}
                      </td>
                      {/* Parcours */}
                      <td className="px-6 py-5">
                        {m.parcour ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span className="p-1">
                              {m.parcour.parcours_nom}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Non défini
                          </span>
                        )}
                      </td>
                      {/* Niveau */}
                      <td className="px-6 py-5">
                        {m.niveau ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <Award className="w-3.5 h-3.5" />
                            <span className="p-1">{m.niveau.niveau_nom}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Non défini
                          </span>
                        )}
                      </td>
                      {/* Mention */}
                      <td className="px-6 py-5">
                        {m.mention ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="p-1">{m.mention.mention_nom}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Non défini
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(m)}
                            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg 
                            transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
                            title="Modifier"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => onDelete(m.matiere_id)}
                            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg 
                            transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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
      </div>

      {/* TABLE */}

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
              matières
            </p>

            <div className="flex items-center gap-3">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border-2 border-gray-200 bg-white rounded-lg
                  focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// Demo avec données d'exemple
export default MatiereList;
