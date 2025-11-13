// import React, { useState } from "react";
// import { updatePresence } from "../../services/PresenceService";

// interface PresenceFormProps {
//   presence: any;
//   onClose: () => void;
//   onUpdated: () => void;
// }

// const PresenceForm: React.FC<PresenceFormProps> = ({
//   presence,
//   onClose,
//   onUpdated,
// }) => {
//   const [status, setStatus] = useState(presence.status || "A");
//   const [heureEntree, setHeureEntree] = useState(presence.heure_entree || "");
//   const [heureSortie, setHeureSortie] = useState(presence.heure_sortie || "");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await updatePresence(presence.presence_id, {
//       status,
//       heure_entree: heureEntree,
//       heure_sortie: heureSortie,
//     });
//     onUpdated();
//     onClose();
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Modifier la présence</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="block text-sm mb-1">Heure d’entrée :</label>
//           <input
//             type="time"
//             value={heureEntree}
//             onChange={(e) => setHeureEntree(e.target.value)}
//             className="border rounded w-full p-2"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="block text-sm mb-1">Heure de sortie :</label>
//           <input
//             type="time"
//             value={heureSortie}
//             onChange={(e) => setHeureSortie(e.target.value)}
//             className="border rounded w-full p-2"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm mb-1">Statut :</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="border rounded w-full p-2"
//           >
//             <option value="P">Présent</option>
//             <option value="A">Absent</option>
//           </select>
//         </div>

//         <div className="flex justify-end gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-400 text-white px-3 py-1 rounded"
//           >
//             Annuler
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-3 py-1 rounded"
//           >
//             Enregistrer
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PresenceForm;
