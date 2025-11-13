// import React, { useEffect, useState } from "react";
// import type { Seance } from "../../types/types";
// import { presenceService } from "../../services/PresenceService";

// interface ListeSeancesProps {
//   onSelectSeance: (seance: Seance) => void;
// }

// const PresenceListSeances: React.FC<ListeSeancesProps> = ({
//   onSelectSeance,
// }) => {
//   const [seances, setSeances] = useState<Seance[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSeances = async () => {
//       try {
//         const data = await presenceService.getAllSeances();
//         console.log("Seances récupérées :", data);
//         setSeances(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSeances();
//   }, []);

//   if (loading) return <p>Chargement des séances...</p>;
//   if (!seances.length) return <p>Aucune séance trouvée.</p>;

//   return (
//     <div className="space-y-2">
//       {seances.map((s) => (
//         <div
//           key={s.seance_id}
//           className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 cursor-pointer flex justify-between items-center"
//         >
//           <div>
//             <p>
//               <strong>Date :</strong> {s.date_seance}
//             </p>
//             <p>
//               <strong>Heure :</strong> {s.heure_debut} - {s.heure_fin}
//             </p>
//           </div>
//           <button
//             onClick={() => onSelectSeance(s)}
//             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Voir fiche
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PresenceListSeances;

import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, BookOpen, ArrowRight } from "lucide-react";
import type { Seance } from "../../types/types";
import { presenceService } from "../../services/PresenceService";

interface ListeSeancesProps {
  onSelectSeance: (seance: Seance) => void;
}

const PresenceListSeances: React.FC<ListeSeancesProps> = ({
  onSelectSeance,
}) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const data = await presenceService.getAllSeances();
        console.log("Séances récupérées :", data);
        setSeances(data);
      } catch (err) {
        console.error("Erreur lors du chargement des séances :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeances();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Chargement des séances...</p>
      </div>
    );

  if (!seances.length)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400">Aucune séance trouvée.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {seances.map((s) => (
        <div
          key={s.seance_id}
          className="group p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex justify-between items-center"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-blue-600 font-semibold text-lg">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              {/* {s.seance_nom || "Nom de la séance non défini"} */}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
              {new Date(s.date_seance).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              {s.heure_debut} - {s.heure_fin}
            </div>
          </div>

          <button
            onClick={() => onSelectSeance(s)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 hover:shadow-md transition-all duration-200"
          >
            Voir fiche
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PresenceListSeances;
