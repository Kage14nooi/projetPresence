// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   UserX,
//   Clock,
//   TrendingUp,
//   Calendar,
//   FileText,
//   Download,
//   Search,
//   AlertCircle,
// } from "lucide-react";
// import {
//   getDashboardData,
//   getRapportEtudiant,
//   type DashboardData,
//   type RapportEtudiant,
// } from "../services/rapportService";

// const Rapport = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [dashboardData, setDashboardData] = useState<DashboardData>({
//     top5Absents: [],
//     topRetards: [],
//     presenceGlobale: "0%",
//     absencesParJour: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchId, setSearchId] = useState("");
//   const [rapportEtudiant, setRapportEtudiant] =
//     useState<RapportEtudiant | null>(null);
//   const [loadingRapport, setLoadingRapport] = useState(false);
//   const [rapportError, setRapportError] = useState<string | null>(null);

//   useEffect(() => {
//     if (activeTab === "dashboard") {
//       fetchDashboardData();
//     }
//   }, [activeTab]);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getDashboardData();
//       setDashboardData(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Une erreur est survenue");
//       console.error("Erreur dashboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRapportEtudiant = async () => {
//     if (!searchId.trim()) {
//       setRapportError("Veuillez entrer un ID");
//       return;
//     }

//     setLoadingRapport(true);
//     setRapportError(null);
//     try {
//       const data = await getRapportEtudiant(searchId);
//       setRapportEtudiant(data);
//     } catch (err) {
//       setRapportError(
//         err instanceof Error ? err.message : "Étudiant non trouvé"
//       );
//       setRapportEtudiant(null);
//     } finally {
//       setLoadingRapport(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       fetchRapportEtudiant();
//     }
//   };

//   const joursMap = [
//     "Dimanche",
//     "Lundi",
//     "Mardi",
//     "Mercredi",
//     "Jeudi",
//     "Vendredi",
//     "Samedi",
//   ];

//   const absencesParJourData = Object.entries(dashboardData.absencesParJour).map(
//     ([jour, count]) => ({
//       jour: joursMap[parseInt(jour)],
//       absences: count,
//     })
//   );

//   const calculateTauxPresence = (presences: number, absences: number) => {
//     const total = presences + absences;
//     return total > 0 ? ((presences / total) * 100).toFixed(1) : "0.0";
//   };

//   const ErrorAlert = ({ message }: { message: string }) => (
//     <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//       <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//       <p className="text-red-800">{message}</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Système de Gestion des Présences
//             </h1>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setActiveTab("dashboard")}
//                 className={`px-4 py-2 rounded-lg font-medium transition ${
//                   activeTab === "dashboard"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setActiveTab("rapport")}
//                 className={`px-4 py-2 rounded-lg font-medium transition ${
//                   activeTab === "rapport"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 Rapport Étudiant
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === "dashboard" && (
//           <div className="space-y-6">
//             {error && <ErrorAlert message={error} />}

//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               </div>
//             ) : (
//               <>
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="bg-white rounded-lg shadow p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">
//                           Taux de Présence Global
//                         </p>
//                         <p className="text-3xl font-bold text-green-600 mt-2">
//                           {dashboardData.presenceGlobale}
//                         </p>
//                       </div>
//                       <div className="bg-green-100 rounded-full p-3">
//                         <TrendingUp className="w-8 h-8 text-green-600" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg shadow p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">
//                           Étudiants Suivis
//                         </p>
//                         <p className="text-3xl font-bold text-red-600 mt-2">
//                           {dashboardData.top5Absents.length}
//                         </p>
//                       </div>
//                       <div className="bg-red-100 rounded-full p-3">
//                         <UserX className="w-8 h-8 text-red-600" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg shadow p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Total Retards</p>
//                         <p className="text-3xl font-bold text-orange-600 mt-2">
//                           {dashboardData.topRetards.reduce(
//                             (acc, r) => acc + parseInt(r.total.toString()),
//                             0
//                           )}
//                         </p>
//                       </div>
//                       <div className="bg-orange-100 rounded-full p-3">
//                         <Clock className="w-8 h-8 text-orange-600" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Charts Row */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Top 5 Absents */}
//                   <div className="bg-white rounded-lg shadow p-6">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center">
//                       <Users className="w-5 h-5 mr-2" />
//                       Top 5 Étudiants Absents
//                     </h3>
//                     {dashboardData.top5Absents.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={dashboardData.top5Absents}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis
//                             dataKey="etudiant.nom"
//                             angle={-45}
//                             textAnchor="end"
//                             height={100}
//                             fontSize={12}
//                           />
//                           <YAxis />
//                           <Tooltip />
//                           <Bar dataKey="total" fill="#ef4444" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="h-64 flex items-center justify-center text-gray-500">
//                         Aucune donnée disponible
//                       </div>
//                     )}
//                   </div>

//                   {/* Absences par Jour */}
//                   <div className="bg-white rounded-lg shadow p-6">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center">
//                       <Calendar className="w-5 h-5 mr-2" />
//                       Absences par Jour de la Semaine
//                     </h3>
//                     {absencesParJourData.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={absencesParJourData}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="jour" fontSize={12} />
//                           <YAxis />
//                           <Tooltip />
//                           <Line
//                             type="monotone"
//                             dataKey="absences"
//                             stroke="#3b82f6"
//                             strokeWidth={2}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="h-64 flex items-center justify-center text-gray-500">
//                         Aucune donnée disponible
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Top Retards */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <Clock className="w-5 h-5 mr-2" />
//                     Top 5 Étudiants en Retard
//                   </h3>
//                   {dashboardData.topRetards.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Étudiant
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Email
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Nombre de Retards
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {dashboardData.topRetards.map((retard, idx) => (
//                             <tr key={idx} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {retard.etudiant?.nom}{" "}
//                                   {retard.etudiant?.prenom}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">
//                                   {retard.etudiant?.email}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
//                                   {retard.total}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       Aucun retard enregistré
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {activeTab === "rapport" && (
//           <div className="space-y-6">
//             {/* Search Bar */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <FileText className="w-5 h-5 mr-2" />
//                 Rechercher un Étudiant
//               </h3>
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     placeholder="Entrez l'ID de l'étudiant"
//                     value={searchId}
//                     onChange={(e) => setSearchId(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <button
//                   onClick={fetchRapportEtudiant}
//                   disabled={loadingRapport}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition"
//                 >
//                   <Search className="w-5 h-5" />
//                   {loadingRapport ? "Recherche..." : "Rechercher"}
//                 </button>
//               </div>
//               {rapportError && (
//                 <div className="mt-4">
//                   <ErrorAlert message={rapportError} />
//                 </div>
//               )}
//             </div>

//             {/* Rapport Details */}
//             {rapportEtudiant && (
//               <div className="space-y-6">
//                 {/* Student Info */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-900">
//                         {rapportEtudiant.etudiant?.nom}{" "}
//                         {rapportEtudiant.etudiant?.prenom}
//                       </h3>
//                       <p className="text-gray-600 mt-1">
//                         {rapportEtudiant.etudiant?.email}
//                       </p>
//                       <p className="text-gray-600">
//                         Matricule: {rapportEtudiant.etudiant?.matricule}
//                       </p>
//                     </div>
//                     <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition">
//                       <Download className="w-5 h-5" />
//                       Exporter PDF
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="bg-blue-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600">Total Présences</p>
//                       <p className="text-2xl font-bold text-blue-600 mt-1">
//                         {rapportEtudiant.total_presences}
//                       </p>
//                     </div>
//                     <div className="bg-red-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600">Total Absences</p>
//                       <p className="text-2xl font-bold text-red-600 mt-1">
//                         {rapportEtudiant.total_absences}
//                       </p>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600">Retards</p>
//                       <p className="text-2xl font-bold text-orange-600 mt-1">
//                         {rapportEtudiant.retards}
//                       </p>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600">Taux de Présence</p>
//                       <p className="text-2xl font-bold text-green-600 mt-1">
//                         {calculateTauxPresence(
//                           rapportEtudiant.total_presences,
//                           rapportEtudiant.total_absences
//                         )}
//                         %
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Absences Details */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h3 className="text-lg font-semibold mb-4">
//                     Détails des Absences
//                   </h3>
//                   {rapportEtudiant.details_absences?.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                               Date
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                               Matière
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                               Horaire
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                               Statut
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {rapportEtudiant.details_absences
//                             .slice(0, 10)
//                             .map((absence, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                   {absence.seance?.date_seance
//                                     ? new Date(
//                                         absence.seance.date_seance
//                                       ).toLocaleDateString("fr-FR")
//                                     : "N/A"}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                   {absence.seance?.matiere?.nom}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                   {absence.seance?.heure_debut} -{" "}
//                                   {absence.seance?.heure_fin}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span
//                                     className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
//                                       absence.statut === "Absent"
//                                         ? "bg-red-100 text-red-800"
//                                         : "bg-orange-100 text-orange-800"
//                                     }`}
//                                   >
//                                     {absence.statut}
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       Aucune absence enregistrée
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {!rapportEtudiant && !loadingRapport && !rapportError && (
//               <div className="bg-white rounded-lg shadow p-12 text-center">
//                 <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600 text-lg">
//                   Entrez un ID d'étudiant pour générer un rapport
//                 </p>
//               </div>
//             )}

//             {loadingRapport && (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Rapport;

// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";
// import {
//   Download,
//   FileText,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Calendar,
//   TrendingDown,
//   Mail,
//   User,
//   Award,
// } from "lucide-react";
// // Remplacer les données mockées par vos appels API
// import { getDashboardDataAvance } from '../services/rapportService';
// import { getRapportCompletEtudiant } from '../services/rapportService';

// // Dans useEffect :
// const fetchData = async () => {
//   const data = await getDashboardDataAvance();
//   setData(data);
// };

// // Données mockées (remplacer par vos appels API réels)
// const mockRapportData = {
//   etudiant: {
//     nom: "RAKOTO",
//     prenom: "Jean",
//     matricule: "ETU001",
//     email: "jean.rakoto@example.com",
//     parcours: "Licence Informatique",
//     mention: "Informatique Générale",
//     niveau: "L2",
//   },
//   resume: {
//     total_absences_completes: 15,
//     total_retards: 8,
//     total_presences: 45,
//     heures_perdues: "45.00",
//     score_regularite: "72.50",
//   },
//   statistiques_par_matiere: [
//     {
//       matiere_nom: "Mathématiques",
//       absences: 5,
//       retards: 3,
//       presences: 12,
//       heures_perdues: 15,
//       pourcentage_absence: "25.00",
//       pourcentage_presence: "60.00",
//     },
//     {
//       matiere_nom: "Algorithmique",
//       absences: 4,
//       retards: 2,
//       presences: 14,
//       heures_perdues: 12,
//       pourcentage_absence: "20.00",
//       pourcentage_presence: "70.00",
//     },
//     {
//       matiere_nom: "Base de Données",
//       absences: 3,
//       retards: 2,
//       presences: 10,
//       heures_perdues: 9,
//       pourcentage_absence: "20.00",
//       pourcentage_presence: "66.67",
//     },
//     {
//       matiere_nom: "Réseaux",
//       absences: 2,
//       retards: 1,
//       presences: 5,
//       heures_perdues: 6,
//       pourcentage_absence: "25.00",
//       pourcentage_presence: "62.50",
//     },
//     {
//       matiere_nom: "Anglais",
//       absences: 1,
//       retards: 0,
//       presences: 4,
//       heures_perdues: 3,
//       pourcentage_absence: "20.00",
//       pourcentage_presence: "80.00",
//     },
//   ],
//   details_absences: [
//     {
//       date: "2024-11-15",
//       matiere: "Mathématiques",
//       heure_debut: "08:00",
//       heure_fin: "11:00",
//       type: "Absence",
//     },
//     {
//       date: "2024-11-10",
//       matiere: "Algorithmique",
//       heure_debut: "13:00",
//       heure_fin: "16:00",
//       type: "Absence",
//     },
//     {
//       date: "2024-11-05",
//       matiere: "Base de Données",
//       heure_debut: "08:00",
//       heure_fin: "10:00",
//       type: "Absence",
//     },
//   ],
//   details_retards: [
//     {
//       date: "2024-11-20",
//       matiere: "Mathématiques",
//       heure_debut: "08:00",
//       heure_fin: "11:00",
//       type: "Retard",
//     },
//     {
//       date: "2024-11-18",
//       matiere: "Réseaux",
//       heure_debut: "13:00",
//       heure_fin: "15:00",
//       type: "Retard",
//     },
//   ],
//   date_generation: new Date().toISOString(),
// };

// const RapportEtudiant = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedEtudiantId, setSelectedEtudiantId] = useState("1");

//   useEffect(() => {
//     // Simuler le chargement
//     setTimeout(() => {
//       setData(mockRapportData);
//       setLoading(false);
//     }, 800);
//   }, [selectedEtudiantId]);

//   const handleExportPDF = () => {
//     window.print();
//   };

//   const getScoreColor = (score) => {
//     const s = parseFloat(score);
//     if (s >= 80) return "text-green-600 bg-green-100";
//     if (s >= 60) return "text-yellow-600 bg-yellow-100";
//     return "text-red-600 bg-red-100";
//   };

//   const getAlerteNiveau = (tauxAbsence) => {
//     const taux = parseFloat(tauxAbsence);
//     if (taux >= 50)
//       return { niveau: "CRITIQUE", color: "bg-red-500", icon: "🔴" };
//     if (taux >= 35)
//       return { niveau: "ÉLEVÉ", color: "bg-orange-500", icon: "🟠" };
//     if (taux >= 25)
//       return { niveau: "ATTENTION", color: "bg-yellow-500", icon: "🟡" };
//     return { niveau: "NORMAL", color: "bg-green-500", icon: "🟢" };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">
//             Génération du rapport...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const tauxAbsenceGlobal = (
//     (data.resume.total_absences_completes /
//       (data.resume.total_absences_completes + data.resume.total_presences)) *
//     100
//   ).toFixed(2);

//   const alerte = getAlerteNiveau(tauxAbsenceGlobal);

//   // Données pour le radar chart
//   const radarData = data.statistiques_par_matiere.map((m) => ({
//     matiere: m.matiere_nom.substring(0, 10),
//     presence: parseFloat(m.pourcentage_presence),
//     absence: parseFloat(m.pourcentage_absence),
//   }));

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 print:p-0">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 print:shadow-none">
//           <div className="flex items-center justify-between mb-6 print:mb-4">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
//                 <User className="text-indigo-600" size={32} />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">
//                   Rapport de Suivi Académique
//                 </h1>
//                 <p className="text-gray-500 text-sm mt-1">
//                   Généré le{" "}
//                   {new Date(data.date_generation).toLocaleDateString("fr-FR")}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleExportPDF}
//               className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 print:hidden"
//             >
//               <Download size={20} />
//               Exporter PDF
//             </button>
//           </div>

//           {/* Info Étudiant */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <User size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">
//                   Nom complet:
//                 </span>
//                 <span className="text-gray-900">
//                   {data.etudiant.prenom} {data.etudiant.nom}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FileText size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">Matricule:</span>
//                 <span className="text-gray-900">{data.etudiant.matricule}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Mail size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">Email:</span>
//                 <span className="text-gray-900">{data.etudiant.email}</span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Award size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">Parcours:</span>
//                 <span className="text-gray-900">{data.etudiant.parcours}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Award size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">Mention:</span>
//                 <span className="text-gray-900">{data.etudiant.mention}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Award size={18} className="text-indigo-600" />
//                 <span className="font-semibold text-gray-700">Niveau:</span>
//                 <span className="text-gray-900">{data.etudiant.niveau}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Alerte et Score */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">
//                   Niveau d'Alerte
//                 </p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="text-2xl">{alerte.icon}</span>
//                   <span
//                     className={`text-xl font-bold ${
//                       alerte.color === "bg-red-500"
//                         ? "text-red-600"
//                         : alerte.color === "bg-orange-500"
//                         ? "text-orange-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {alerte.niveau}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Taux: {tauxAbsenceGlobal}%
//                 </p>
//               </div>
//               <AlertTriangle className="text-red-500" size={32} />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">
//                   Score de Régularité
//                 </p>
//                 <p
//                   className={`text-3xl font-bold mt-2 ${
//                     getScoreColor(data.resume.score_regularite).split(" ")[0]
//                   }`}
//                 >
//                   {data.resume.score_regularite}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">Sur 100 points</p>
//               </div>
//               <div
//                 className={`p-3 rounded-full ${
//                   getScoreColor(data.resume.score_regularite).split(" ")[1]
//                 }`}
//               >
//                 <TrendingDown
//                   size={32}
//                   className={
//                     getScoreColor(data.resume.score_regularite).split(" ")[0]
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">
//                   Heures Perdues
//                 </p>
//                 <p className="text-3xl font-bold text-orange-600 mt-2">
//                   {data.resume.heures_perdues}h
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">Total cumulé</p>
//               </div>
//               <Clock className="text-orange-500" size={32} />
//             </div>
//           </div>
//         </div>

//         {/* Statistiques Résumées */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             📊 Résumé des Statistiques
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-4 bg-red-50 rounded-lg">
//               <p className="text-3xl font-bold text-red-600">
//                 {data.resume.total_absences_completes}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Absences Complètes</p>
//             </div>
//             <div className="text-center p-4 bg-orange-50 rounded-lg">
//               <p className="text-3xl font-bold text-orange-600">
//                 {data.resume.total_retards}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Retards</p>
//             </div>
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <p className="text-3xl font-bold text-green-600">
//                 {data.resume.total_presences}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Présences</p>
//             </div>
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <p className="text-3xl font-bold text-blue-600">
//                 {data.resume.total_absences_completes +
//                   data.resume.total_retards +
//                   data.resume.total_presences}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Total Séances</p>
//             </div>
//           </div>
//         </div>

//         {/* Graphiques */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:grid-cols-1">
//           {/* Radar Chart */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">
//               Performance par Matière
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <RadarChart data={radarData}>
//                 <PolarGrid />
//                 <PolarAngleAxis dataKey="matiere" />
//                 <PolarRadiusAxis angle={90} domain={[0, 100]} />
//                 <Radar
//                   name="Présence %"
//                   dataKey="presence"
//                   stroke="#22c55e"
//                   fill="#22c55e"
//                   fillOpacity={0.6}
//                 />
//                 <Radar
//                   name="Absence %"
//                   dataKey="absence"
//                   stroke="#ef4444"
//                   fill="#ef4444"
//                   fillOpacity={0.6}
//                 />
//                 <Legend />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Bar Chart Détaillé */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">
//               Détails par Matière
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={data.statistiques_par_matiere}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="matiere_nom"
//                   angle={-45}
//                   textAnchor="end"
//                   height={100}
//                 />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="presences" fill="#22c55e" name="Présences" />
//                 <Bar dataKey="absences" fill="#ef4444" name="Absences" />
//                 <Bar dataKey="retards" fill="#f97316" name="Retards" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Tableau Détaillé par Matière */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             📚 Détails par Matière
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                     Matière
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     Absences
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     Retards
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     Présences
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     Heures Perdues
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     % Absence
//                   </th>
//                   <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                     % Présence
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.statistiques_par_matiere.map((stat, index) => (
//                   <tr key={index} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3 font-medium">
//                       {stat.matiere_nom}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-semibold">
//                         {stat.absences}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold">
//                         {stat.retards}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
//                         {stat.presences}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-center font-semibold">
//                       {stat.heures_perdues}h
//                     </td>
//                     <td className="px-4 py-3 text-center text-red-600 font-semibold">
//                       {stat.pourcentage_absence}%
//                     </td>
//                     <td className="px-4 py-3 text-center text-green-600 font-semibold">
//                       {stat.pourcentage_presence}%
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Historique des Absences */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               🔴 Dernières Absences
//             </h2>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {data.details_absences.map((abs, index) => (
//                 <div
//                   key={index}
//                   className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         {abs.matiere}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {new Date(abs.date).toLocaleDateString("fr-FR")}
//                       </p>
//                     </div>
//                     <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
//                       {abs.heure_debut} - {abs.heure_fin}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               🟠 Derniers Retards
//             </h2>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {data.details_retards.map((ret, index) => (
//                 <div
//                   key={index}
//                   className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         {ret.matiere}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {new Date(ret.date).toLocaleDateString("fr-FR")}
//                       </p>
//                     </div>
//                     <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
//                       {ret.heure_debut} - {ret.heure_fin}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recommandations */}
//         <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg p-6 text-white print:bg-gray-100 print:text-gray-800">
//           <h2 className="text-2xl font-bold mb-4">💡 Recommandations</h2>
//           <ul className="space-y-2">
//             {parseFloat(tauxAbsenceGlobal) >= 25 && (
//               <li className="flex items-start gap-2">
//                 <span>⚠️</span>
//                 <span>
//                   Convocation recommandée - Taux d'absence critique dépassant le
//                   seuil de 25%
//                 </span>
//               </li>
//             )}
//             {parseFloat(data.resume.score_regularite) < 70 && (
//               <li className="flex items-start gap-2">
//                 <span>📉</span>
//                 <span>
//                   Score de régularité faible - Suivi rapproché nécessaire
//                 </span>
//               </li>
//             )}
//             {data.resume.total_retards > 5 && (
//               <li className="flex items-start gap-2">
//                 <span>⏰</span>
//                 <span>
//                   Nombre de retards élevé - Sensibilisation à la ponctualité
//                   recommandée
//                 </span>
//               </li>
//             )}
//             <li className="flex items-start gap-2">
//               <span>📧</span>
//               <span>
//                 Notification automatique envoyée à l'étudiant et au responsable
//                 pédagogique
//               </span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RapportEtudiant;

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
// import { useRef } from "react";
import PDFRapportEtudiant from "../composants/Pdf/PDFRapportEtudiant";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Download,
  FileText,
  AlertTriangle,
  Clock,
  TrendingDown,
  Mail,
  User,
  Award,
} from "lucide-react";
import {
  getRapportCompletEtudiant,
  type RapportComplet,
} from "../services/rapportService";

interface RapportEtudiantProps {
  etudiantId?: string | number;
}
export interface Etudiant {
  etudiant_id: number;
  etudiant_prenom: string;
  etudiant_nom: string;
  etudiant_matricule: string;
  etudiant_mail: string;
  etudiant_tel?: string;
  role_id?: number;
  device_user_id?: string;
  mention?: {
    mention_id: number;
    mention_nom: string;
  };
  niveau?: {
    niveau_id: number;
    niveau_nom: string;
  };
  parcour?: {
    parcours_id: number;
    parcours_nom: string;
  };
}

interface RadarDataItem {
  matiere: string;
  presence: number;
  absence: number;
}

const Rapport: React.FC<RapportEtudiantProps> = ({}) => {
  const [data, setData] = useState<RapportComplet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedId, setSelectedId] = useState<string | number>(
  //   etudiantId || "1"
  // );
  const { id } = useParams();
  const [selectedId, setSelectedId] = useState(id || "1");

  useEffect(() => {
    if (selectedId) {
      loadRapportEtudiant(selectedId);
    }
  }, [selectedId]);

  const loadRapportEtudiant = async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRapportCompletEtudiant(id);
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Erreur chargement rapport:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleExportPDF = () => {
  //   window.print();
  // };
  // const componentRef = useRef<HTMLDivElement>(null);
  // const handleExportPDF = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: `rapport_etudiant_${selectedId}`,
  // });

  // const handleExportPDF = async () => {
  //   console.log("mety");

  //   const element = document.getElementById("rapport-container");
  //   if (!element) return;

  //   const canvas = await html2canvas(element, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`rapport_etudiant_${selectedId}.pdf`);
  // };
  const handleExportPDF = async () => {
    const element = document.getElementById("pdf-rapport");
    if (!element) return;

    try {
      // Afficher un loader
      const loadingToast = document.createElement("div");
      loadingToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4f46e5;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-family: Inter, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;
      loadingToast.textContent = "Génération du PDF en cours...";
      document.body.appendChild(loadingToast);

      // Capturer l'élément en haute qualité
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Gérer les pages multiples si nécessaire
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          position,
          imgWidth * ratio,
          imgHeight * ratio
        );
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `rapport_etudiant_${data?.etudiant.etudiant_matricule}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Retirer le loader
      document.body.removeChild(loadingToast);

      // Afficher un message de succès
      const successToast = document.createElement("div");
      successToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-family: Inter, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;
      successToast.textContent = "✓ PDF généré avec succès !";
      document.body.appendChild(successToast);
      setTimeout(() => document.body.removeChild(successToast), 3000);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF");
    }
  };

  const getScoreColor = (score: string): string => {
    const s = parseFloat(score);
    if (s >= 80) return "text-green-600 bg-green-100";
    if (s >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getAlerteNiveau = (tauxAbsence: string) => {
    const taux = parseFloat(tauxAbsence);
    if (taux >= 50)
      return { niveau: "CRITIQUE", color: "bg-red-500", icon: "🔴" };
    if (taux >= 35)
      return { niveau: "ÉLEVÉ", color: "bg-orange-500", icon: "🟠" };
    if (taux >= 25)
      return { niveau: "ATTENTION", color: "bg-yellow-500", icon: "🟡" };
    return { niveau: "NORMAL", color: "bg-green-500", icon: "🟢" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Génération du rapport...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => loadRapportEtudiant(selectedId)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const tauxAbsenceGlobal = (
    (data.resume.total_absences_completes /
      (data.resume.total_absences_completes + data.resume.total_presences)) *
    100
  ).toFixed(2);

  const alerte = getAlerteNiveau(tauxAbsenceGlobal);
  console.log(data);
  // Données pour le radar chart
  const radarData: RadarDataItem[] =
    data.statistiques_par_matiere?.map((m: any) => ({
      matiere: m.matiere_nom.substring(0, 10),
      presence: parseFloat(m.pourcentage_presence),
      absence: parseFloat(m.pourcentage_absence),
    })) || [];

  return (
    <div
      className="min-h-screen bg-gray-50 p-6 print:p-0"
      id="rapport-container"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 print:shadow-none">
          <div className="flex items-center justify-between mb-6 print:mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="text-indigo-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">
                  Rapport de Suivi Académique
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Généré le{" "}
                  {new Date(data.date_generation).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 print:hidden"
            >
              <Download size={20} />
              Exporter PDF
            </button>
          </div>

          {/* Info Étudiant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">
                  Nom complet:
                </span>
                <span className="text-gray-900">
                  {data.etudiant.etudiant_prenom} {data.etudiant.etudiant_nom}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">Matricule:</span>
                <span className="text-gray-900">
                  {data.etudiant.etudiant_matricule}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-900">
                  {data.etudiant.etudiant_mail}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">Parcours:</span>
                <span className="text-gray-900">
                  {data.etudiant.parcour?.parcours_nom || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">Mention:</span>
                <span className="text-gray-900">
                  {data.etudiant.mention?.mention_nom || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span className="font-semibold text-gray-700">Niveau:</span>
                <span className="text-gray-900">
                  {data.etudiant.niveau?.niveau_nom || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerte et Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Niveau d'Alerte
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl">{alerte.icon}</span>
                  <span
                    className={`text-xl font-bold ${
                      alerte.color === "bg-red-500"
                        ? "text-red-600"
                        : alerte.color === "bg-orange-500"
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {alerte.niveau}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Taux: {tauxAbsenceGlobal}%
                </p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Score de Régularité
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    getScoreColor(data.resume.score_regularite).split(" ")[0]
                  }`}
                >
                  {data.resume.score_regularite}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sur 100 points</p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  getScoreColor(data.resume.score_regularite).split(" ")[1]
                }`}
              >
                <TrendingDown
                  size={32}
                  className={
                    getScoreColor(data.resume.score_regularite).split(" ")[0]
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Heures Perdues
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {data.resume.heures_perdues}h
                </p>
                <p className="text-xs text-gray-500 mt-1">Total cumulé</p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Statistiques Résumées */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Résumé des Statistiques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">
                {data.resume.total_absences_completes}
              </p>
              <p className="text-sm text-gray-600 mt-1">Absences Complètes</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">
                {data.resume.total_retards}
              </p>
              <p className="text-sm text-gray-600 mt-1">Retards</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {data.resume.total_presences}
              </p>
              <p className="text-sm text-gray-600 mt-1">Présences</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {data.resume.total_absences_completes +
                  data.resume.total_retards +
                  data.resume.total_presences}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Séances</p>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:grid-cols-1">
          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Performance par Matière
            </h2>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="matiere" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Présence %"
                    dataKey="presence"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Absence %"
                    dataKey="absence"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Bar Chart Détaillé */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Détails par Matière
            </h2>
            {data.statistiques_par_matiere &&
            data.statistiques_par_matiere.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.statistiques_par_matiere}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="matiere_nom"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="presences" fill="#22c55e" name="Présences" />
                  <Bar dataKey="absences" fill="#ef4444" name="Absences" />
                  <Bar dataKey="retards" fill="#f97316" name="Retards" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Tableau Détaillé par Matière */}
        {data.statistiques_par_matiere &&
          data.statistiques_par_matiere.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📚 Détails par Matière
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Matière
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Absences
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Retards
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Présences
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Heures Perdues
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        % Absence
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        % Présence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.statistiques_par_matiere.map(
                      (stat: any, index: number) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {stat.matiere_nom}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-semibold">
                              {stat.absences}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold">
                              {stat.retards}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
                              {stat.presences}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">
                            {stat.heures_perdues}h
                          </td>
                          <td className="px-4 py-3 text-center text-red-600 font-semibold">
                            {stat.pourcentage_absence}%
                          </td>
                          <td className="px-4 py-3 text-center text-green-600 font-semibold">
                            {stat.pourcentage_presence}%
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Historique des Absences et Retards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Absences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔴 Dernières Absences
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.details_absences && data.details_absences.length > 0 ? (
                data.details_absences.map((abs: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {abs.matiere}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(abs.date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                        {abs.heure_debut} - {abs.heure_fin}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Aucune absence enregistrée
                </div>
              )}
            </div>
          </div>

          {/* Retards */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🟠 Derniers Retards
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.details_retards && data.details_retards.length > 0 ? (
                data.details_retards.map((ret: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {ret.matiere}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(ret.date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                        {ret.heure_debut} - {ret.heure_fin}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Aucun retard enregistré
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg p-6 text-white print:bg-gray-100 print:text-gray-800">
          <h2 className="text-2xl font-bold mb-4">💡 Recommandations</h2>
          <ul className="space-y-2">
            {parseFloat(tauxAbsenceGlobal) >= 25 && (
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  Convocation recommandée - Taux d'absence critique dépassant le
                  seuil de 25%
                </span>
              </li>
            )}
            {parseFloat(data.resume.score_regularite) < 70 && (
              <li className="flex items-start gap-2">
                <span>📉</span>
                <span>
                  Score de régularité faible - Suivi rapproché nécessaire
                </span>
              </li>
            )}
            {data.resume.total_retards > 5 && (
              <li className="flex items-start gap-2">
                <span>⏰</span>
                <span>
                  Nombre de retards élevé - Sensibilisation à la ponctualité
                  recommandée
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span>📧</span>
              <span>
                Notification automatique envoyée à l'étudiant et au responsable
                pédagogique
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* Composant PDF caché - utilisé uniquement pour l'export */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <PDFRapportEtudiant data={data} />
      </div>
      ;
    </div>
  );
};

export default Rapport;
