// import React, { useEffect, useState } from "react";
// import { Edit2, Trash2, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");

// interface SeanceListProps {
//   seances: any[];
//   matieres: any[];
//   onEdit: (s: any) => void;
//   onDelete: (id: number) => void;
//   onToggleActive: (id: number) => Promise<void>;
// }

// const SeanceList: React.FC<SeanceListProps> = ({
//   seances,
//   onEdit,
//   onDelete,
//   onToggleActive,
// }) => {
//   const navigate = useNavigate();
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [localSeances, setLocalSeances] = useState(seances);

//   // ⏰ Mise à jour automatique de l'heure
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     return () => clearInterval(timer);
//   }, []);

//   // 🔄 Sync props → state
//   useEffect(() => {
//     const sorted = [...seances].sort((a, b) => {
//       const dateA = new Date(`${a.date_seance} ${a.heure_debut}`);
//       const dateB = new Date(`${b.date_seance} ${b.heure_debut}`);
//       return dateB.getTime() - dateA.getTime(); // Plus récent → plus ancien
//     });

//     setLocalSeances(sorted);
//   }, [seances]);

//   // =============== SOCKET.IO LISTENER ===============
//   useEffect(() => {
//     socket.on("seance_auto_update", ({ seance_id, is_active }) => {
//       setLocalSeances((prev) =>
//         prev.map((s) => (s.seance_id === seance_id ? { ...s, is_active } : s))
//       );
//     });

//     return () => {
//       socket.off("seance_auto_update");
//     };
//   }, []);
//   // ==================================================

//   // 🔍 Vérifier si une séance est terminée
//   const isSeanceTerminee = (seance: any): boolean => {
//     const now = new Date();
//     const seanceDate = new Date(seance.date_seance);

//     if (!seance.heure_fin) return false;

//     const [h, m] = seance.heure_fin.split(":");
//     seanceDate.setHours(parseInt(h), parseInt(m), 0, 0);

//     return now > seanceDate;
//   };

//   // 🔍 Vérifier si une séance est en cours
//   const isSeanceEnCours = (seance: any): boolean => {
//     const now = new Date();
//     const seanceDate = new Date(seance.date_seance);

//     if (!seance.heure_debut || !seance.heure_fin) return false;

//     const [dh, dm] = seance.heure_debut.split(":");
//     const [fh, fm] = seance.heure_fin.split(":");

//     const debut = new Date(seanceDate);
//     debut.setHours(parseInt(dh), parseInt(dm), 0, 0);

//     const fin = new Date(seanceDate);
//     fin.setHours(parseInt(fh), parseInt(fm), 0, 0);

//     return now >= debut && now <= fin;
//   };

//   const handleToggle = async (s: any) => {
//     if (isSeanceTerminee(s)) {
//       alert("Cette séance est déjà terminée.");
//       return;
//     }

//     const wasActive = s.is_active;
//     await onToggleActive(s.seance_id);

//     if (!wasActive) navigate("/presence");
//   };

//   // 🎨 Statut Séance
//   const getStatusBadge = (seance: any) => {
//     if (isSeanceTerminee(seance)) {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//           <Clock className="w-3 h-3 mr-1" />
//           Terminée
//         </span>
//       );
//     }

//     if (isSeanceEnCours(seance)) {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 animate-pulse">
//           <Clock className="w-3 h-3 mr-1" />
//           En cours
//         </span>
//       );
//     }

//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
//         <Clock className="w-3 h-3 mr-1" />À venir
//       </span>
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3">Matière</th>
//             <th className="px-6 py-3">Date</th>
//             <th className="px-6 py-3">Début</th>
//             <th className="px-6 py-3">Fin</th>
//             <th className="px-6 py-3 text-center">Statut</th>
//             <th className="px-6 py-3 text-center">Active</th>
//             <th className="px-6 py-3 text-center">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {localSeances.map((s) => {
//             const terminee = isSeanceTerminee(s);

//             return (
//               <tr
//                 key={s.seance_id}
//                 className={terminee ? "bg-gray-100 opacity-70" : ""}
//               >
//                 <td className="px-6 py-4">{s.matiere?.matiere_nom}</td>
//                 <td className="px-6 py-4">{s.date_seance}</td>
//                 <td className="px-6 py-4">{s.heure_debut}</td>
//                 <td className="px-6 py-4">{s.heure_fin}</td>
//                 <td className="px-6 py-4 text-center">{getStatusBadge(s)}</td>

//                 {/* 🔘 TOGGLE */}
//                 <td className="px-6 py-4 text-center">
//                   <button
//                     onClick={() => handleToggle(s)}
//                     disabled={terminee}
//                     className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
//                       terminee
//                         ? "bg-gray-300 cursor-not-allowed"
//                         : s.is_active
//                         ? "bg-green-500"
//                         : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-5 w-5 transform bg-white rounded-full transition ${
//                         s.is_active ? "translate-x-6" : "translate-x-1"
//                       }`}
//                     />
//                   </button>
//                 </td>

//                 {/* ACTIONS Désactivées si terminé */}
//                 <td className="px-6 py-4 text-center flex justify-center gap-3">
//                   <button
//                     onClick={() => !terminee && onEdit(s)}
//                     disabled={terminee}
//                     className={`${
//                       terminee
//                         ? "text-gray-400 cursor-not-allowed"
//                         : "text-blue-600 hover:text-blue-800"
//                     }`}
//                   >
//                     <Edit2 className="w-5 h-5" />
//                   </button>

//                   <button
//                     onClick={() => !terminee && onDelete(s.seance_id)}
//                     disabled={terminee}
//                     className={`${
//                       terminee
//                         ? "text-gray-400 cursor-not-allowed"
//                         : "text-red-600 hover:text-red-800"
//                     }`}
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}

//           {localSeances.length === 0 && (
//             <tr>
//               <td colSpan={7} className="py-4 text-center text-gray-500">
//                 Aucune séance trouvée.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SeanceList;

import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  Calendar,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Simuler socket.io pour la démo
const socket = {
  on: (event: string, callback: any) => {},
  off: (event: string) => {},
};

interface SeanceListProps {
  seances: any[];
  matieres: any[];
  onEdit: (s: any) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => Promise<void>;
  onNavigateToPresence?: () => void;
}

const SeanceList: React.FC<SeanceListProps> = ({
  seances,
  matieres,
  onEdit,
  onDelete,
  onToggleActive,
  onNavigateToPresence,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localSeances, setLocalSeances] = useState(seances);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<number | "">("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ⏰ Mise à jour automatique de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // 🔄 Sync props → state
  useEffect(() => {
    const sorted = [...seances].sort((a, b) => {
      const dateA = new Date(`${a.date_seance} ${a.heure_debut}`);
      const dateB = new Date(`${b.date_seance} ${b.heure_debut}`);
      return dateB.getTime() - dateA.getTime();
    });

    setLocalSeances(sorted);
  }, [seances]);

  // =============== SOCKET.IO LISTENER ===============
  useEffect(() => {
    socket.on("seance_auto_update", ({ seance_id, is_active }) => {
      setLocalSeances((prev) =>
        prev.map((s) => (s.seance_id === seance_id ? { ...s, is_active } : s))
      );
    });

    return () => {
      socket.off("seance_auto_update");
    };
  }, []);

  // 🔍 Vérifier si une séance est terminée
  const isSeanceTerminee = (seance: any): boolean => {
    const now = new Date();
    const seanceDate = new Date(seance.date_seance);

    if (!seance.heure_fin) return false;

    const [h, m] = seance.heure_fin.split(":");
    seanceDate.setHours(parseInt(h), parseInt(m), 0, 0);

    return now > seanceDate;
  };

  // 🔍 Vérifier si une séance est en cours
  const isSeanceEnCours = (seance: any): boolean => {
    const now = new Date();
    const seanceDate = new Date(seance.date_seance);

    if (!seance.heure_debut || !seance.heure_fin) return false;

    const [dh, dm] = seance.heure_debut.split(":");
    const [fh, fm] = seance.heure_fin.split(":");

    const debut = new Date(seanceDate);
    debut.setHours(parseInt(dh), parseInt(dm), 0, 0);

    const fin = new Date(seanceDate);
    fin.setHours(parseInt(fh), parseInt(fm), 0, 0);

    return now >= debut && now <= fin;
  };

  const getSeanceStatus = (seance: any): string => {
    if (isSeanceTerminee(seance)) return "terminee";
    if (isSeanceEnCours(seance)) return "en_cours";
    return "a_venir";
  };

  // Filtrage
  const filteredSeances = localSeances.filter((s) => {
    const matchSearch =
      !searchTerm ||
      s.matiere?.matiere_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.date_seance.includes(searchTerm);

    const matchMatiere =
      !selectedMatiere || s.matiere?.matiere_id === selectedMatiere;
    const matchStatus =
      !selectedStatus || getSeanceStatus(s) === selectedStatus;

    return matchSearch && matchMatiere && matchStatus;
  });

  // Statistiques
  const stats = {
    total: filteredSeances.length,
    actives: filteredSeances.filter((s) => s.is_active).length,
    enCours: filteredSeances.filter((s) => isSeanceEnCours(s)).length,
    aVenir: filteredSeances.filter(
      (s) => !isSeanceTerminee(s) && !isSeanceEnCours(s)
    ).length,
    terminees: filteredSeances.filter((s) => isSeanceTerminee(s)).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredSeances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSeances = filteredSeances.slice(startIndex, endIndex);

  const handleToggle = async (s: any) => {
    if (isSeanceTerminee(s)) {
      alert("Cette séance est déjà terminée.");
      return;
    }

    const wasActive = s.is_active;
    await onToggleActive(s.seance_id);

    if (!wasActive && onNavigateToPresence) {
      onNavigateToPresence();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMatiere("");
    setSelectedStatus("");
  };

  // 🎨 Statut Séance
  const getStatusBadge = (seance: any) => {
    if (isSeanceTerminee(seance)) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Terminée
        </span>
      );
    }

    if (isSeanceEnCours(seance)) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 animate-pulse">
          <Clock className="w-3 h-3 mr-1" />
          En cours
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        <Clock className="w-3 h-3 mr-1" />À venir
      </span>
    );
  };

  const matiereOptions = Array.from(
    new Set(localSeances.map((s) => s.matiere?.matiere_id))
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec gradient moderne */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Gestion des Séances
              </h1>
              <p className="text-purple-100">
                Planification et suivi des cours en temps réel
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 border-2 border-white/30">
              <p className="text-white/90 text-sm font-medium mb-1 text-center">
                Total Séances
              </p>
              <p className="text-5xl font-bold text-white text-center">
                {filteredSeances.length}
              </p>
              {searchTerm || selectedMatiere || selectedStatus ? (
                <p className="text-white/80 text-xs mt-2 text-center">
                  sur {localSeances.length} au total
                </p>
              ) : null}
            </div>
          </div>

          {/* Statistiques en cartes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Actives</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.actives}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.actives / stats.total) * 100)
                      : 0}
                    % du total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">En Cours</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.enCours}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.enCours / stats.total) * 100)
                      : 0}
                    % du total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-300 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">À Venir</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.aVenir}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.aVenir / stats.total) * 100)
                      : 0}
                    % du total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Terminées</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.terminees}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.terminees / stats.total) * 100)
                      : 0}
                    % du total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-400/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gray-300" />
                </div>
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
              placeholder="Rechercher par matière, date..."
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="">Toutes les matières</option>
                    {matiereOptions.map((mId) => {
                      const matiere = localSeances.find(
                        (s) => s.matiere?.matiere_id === mId
                      )?.matiere;
                      return (
                        <option key={mId} value={mId}>
                          {matiere?.matiere_nom}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Statut
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="en_cours">En cours</option>
                    <option value="a_venir">À venir</option>
                    <option value="terminee">Terminée</option>
                  </select>
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
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Matière
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date & Horaires
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Active
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentSeances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          Aucune séance trouvée
                        </p>
                        <p className="text-sm mt-2">
                          Essayez de modifier vos critères de recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentSeances.map((s) => {
                    const terminee = isSeanceTerminee(s);
                    const enCours = isSeanceEnCours(s);

                    return (
                      <tr
                        key={s.seance_id}
                        className={`hover:bg-purple-50 transition-colors ${
                          terminee ? "bg-gray-50 opacity-70" : ""
                        } ${enCours ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {s.matiere?.matiere_nom
                                ?.substring(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {s.matiere?.matiere_nom}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {s.date_seance}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {s.heure_debut} - {s.heure_fin}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(s)}
                        </td>

                        {/* 🔘 TOGGLE */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggle(s)}
                            disabled={terminee}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-sm ${
                              terminee
                                ? "bg-gray-300 cursor-not-allowed"
                                : s.is_active
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gray-300 hover:bg-gray-400"
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform bg-white rounded-full transition-transform shadow-md ${
                                s.is_active ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => !terminee && onEdit(s)}
                              disabled={terminee}
                              className={`p-2 rounded-lg transition-all ${
                                terminee
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => !terminee && onDelete(s.seance_id)}
                              disabled={terminee}
                              className={`p-2 rounded-lg transition-all ${
                                terminee
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination moderne */}
          {filteredSeances.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Affichage de{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredSeances.length)}
                </span>{" "}
                sur{" "}
                <span className="font-medium text-gray-900">
                  {filteredSeances.length}
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

export default SeanceList;
