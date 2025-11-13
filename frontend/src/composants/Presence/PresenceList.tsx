// import React, { useState } from "react";
// import {
//   deletePresence,
//   generateAbsences,
// } from "../../services/PresenceService";

// interface PresenceListProps {
//   presences: any[];
//   onEdit: (presence: any) => void;
//   onDeleted: () => void;
//   onGenerated: () => void;
// }

// const PresenceList: React.FC<PresenceListProps> = ({
//   presences,
//   onEdit,
//   onDeleted,
//   onGenerated,
// }) => {
//   const [matiereId, setMatiereId] = useState<number | "">("");
//   const [date, setDate] = useState("");

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Voulez-vous supprimer cette présence ?")) {
//       await deletePresence(id);
//       onDeleted();
//     }
//   };

//   const handleGenerate = async () => {
//     if (!matiereId || !date) {
//       alert("Veuillez renseigner la matière et la date !");
//       return;
//     }
//     await generateAbsences({ matiere_id: matiereId, date });
//     onGenerated();
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <div className="flex items-end justify-between mb-4">
//         <div className="flex gap-2 items-center">
//           <div>
//             <label className="text-sm block">Matière ID :</label>
//             <input
//               type="number"
//               value={matiereId}
//               onChange={(e) => setMatiereId(Number(e.target.value))}
//               className="border rounded p-1 w-24"
//             />
//           </div>
//           <div>
//             <label className="text-sm block">Date :</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="border rounded p-1"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleGenerate}
//           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//         >
//           Générer les absences
//         </button>
//       </div>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200 text-left">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Étudiant ID</th>
//             <th className="border p-2">Séance ID</th>
//             <th className="border p-2">Heure entrée</th>
//             <th className="border p-2">Heure sortie</th>
//             <th className="border p-2">Statut</th>
//             <th className="border p-2 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {presences.map((p) => (
//             <tr key={p.presence_id}>
//               <td className="border p-2">{p.presence_id}</td>
//               <td className="border p-2">{p.etudiant_id}</td>
//               <td className="border p-2">{p.seance_id}</td>
//               <td className="border p-2">{p.heure_entree || "-"}</td>
//               <td className="border p-2">{p.heure_sortie || "-"}</td>
//               <td className="border p-2">
//                 {p.status === "P" ? "Présent" : "Absent"}
//               </td>
//               <td className="border p-2 text-center space-x-2">
//                 <button
//                   onClick={() => onEdit(p)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded"
//                 >
//                   Modifier
//                 </button>
//                 <button
//                   onClick={() => handleDelete(p.presence_id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Supprimer
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {presences.length === 0 && (
//             <tr>
//               <td colSpan={7} className="text-center py-4 text-gray-500">
//                 Aucune présence enregistrée
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PresenceList;
