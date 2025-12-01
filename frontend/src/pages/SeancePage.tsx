// import React, { useEffect, useState } from "react";
// import {
//   getSeances,
//   createSeance,
//   updateSeance,
//   deleteSeance,
//   toggleSeanceActive,
// } from "../services/SeanceService";
// import { CalendarDays, Plus } from "lucide-react";
// import { getMatieres } from "../services/MatiereService";
// import SeanceList from "../composants/Seance/SeanceList";
// import SeanceModal from "../composants/Seance/SeanceModal";

// const initialFormData = {
//   seance_id: null,
//   matiere_id: "",
//   date_seance: "",
//   heure_debut: "",
//   heure_fin: "",
// };

// const SeancePage: React.FC = () => {
//   const [seances, setSeances] = useState<any[]>([]);
//   const [matieres, setMatieres] = useState<any[]>([]);
//   const [formData, setFormData] = useState<any>(initialFormData);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [loading, setLoading] = useState(true);

//   // Récupérer la liste des séances
//   const fetchSeances = async () => {
//     try {
//       const data = await getSeances();
//       setSeances(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer la liste des matières
//   const fetchMatieres = async () => {
//     try {
//       const data = await getMatieres();
//       setMatieres(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSeances();
//     fetchMatieres();
//   }, []);

//   // Gestion de la soumission du formulaire
//   const handleSubmit = async (data: any) => {
//     // Validation simple côté frontend
//     const newErrors: any = {};
//     if (!data.matiere_id) newErrors.matiere_id = "La matière est requise";
//     if (!data.date_seance) newErrors.date_seance = "La date est requise";
//     if (!data.heure_debut)
//       newErrors.heure_debut = "L'heure de début est requise";
//     if (!data.heure_fin) newErrors.heure_fin = "L'heure de fin est requise";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       if (data.seance_id) {
//         await updateSeance(data.seance_id, data);
//       } else {
//         await createSeance(data);
//       }

//       setIsModalOpen(false);
//       setFormData(initialFormData);
//       setErrors({});
//       fetchSeances();
//     } catch (err: any) {
//       console.error(err);
//       setErrors(err.response?.data?.errors || {});
//     }
//   };

//   // Supprimer une séance
//   const handleDelete = async (id: number) => {
//     if (!confirm("Voulez-vous vraiment supprimer cette séance ?")) return;

//     try {
//       await deleteSeance(id);
//       fetchSeances();
//     } catch (err: any) {
//       console.error("Erreur lors de la suppression:", err);
//       alert(
//         `Erreur lors de la suppression: ${
//           err.response?.data?.error || err.message || "Erreur inconnue"
//         }`
//       );
//     }
//   };

//   // Activer / désactiver une séance
//   const handleToggleActive = async (seanceId: number) => {
//     try {
//       console.log("tonga eto ", seanceId);

//       await toggleSeanceActive(seanceId);
//       fetchSeances();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="h-screen h-full w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//       {/* En-tête de la page */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
//                 <CalendarDays className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Gestion des Séances
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Gérez et planifiez les séances de cours
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 setFormData(initialFormData);
//                 setIsModalOpen(true);
//                 setErrors({});
//               }}
//               className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//             >
//               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
//               <span className="font-semibold">Ajouter une séance</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Conteneur principal avec la liste */}
//       <div className="flex-1 overflow-auto px-6 py-6">
//         <div className="h-full">
//           {loading ? (
//             <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
//               <div className="text-center">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//                 <p className="text-gray-600 font-medium">
//                   Chargement des séances...
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <SeanceList
//               seances={seances}
//               onEdit={(s) => {
//                 setFormData({
//                   ...s,
//                   date_debut_initiale: s.date_seance,
//                   heure_debut_initiale: s.heure_debut,
//                 });
//                 setIsModalOpen(true);
//                 setErrors({});
//               }}
//               onDelete={handleDelete}
//               onToggleActive={handleToggleActive}
//             />
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       <SeanceModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setFormData(initialFormData);
//           setIsModalOpen(false);
//           setErrors({});
//         }}
//         formData={formData}
//         setFormData={setFormData}
//         onSubmit={handleSubmit}
//         errors={errors}
//         setErrors={setErrors}
//         matieres={matieres}
//       />
//     </div>
//   );
// };

// export default SeancePage;

import React, { useEffect, useState } from "react";
import {
  getSeances,
  createSeance,
  updateSeance,
  deleteSeance,
  toggleSeanceActive,
} from "../services/SeanceService";
import { CalendarDays, Plus } from "lucide-react";
import { getMatieres } from "../services/MatiereService";
import { getAppareils } from "../services/appareilService"; // <-- ajout
import SeanceList from "../composants/Seance/SeanceList";
import SeanceModal from "../composants/Seance/SeanceModal";

const initialFormData = {
  seance_id: null,
  matiere_id: "",
  appareil_id: "", // <-- ajout
  date_seance: "",
  heure_debut: "",
  heure_fin: "",
};

const SeancePage: React.FC = () => {
  const [seances, setSeances] = useState<any[]>([]);
  const [matieres, setMatieres] = useState<any[]>([]);
  const [appareils, setAppareils] = useState<any[]>([]); // <-- ajout
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des séances
  const fetchSeances = async () => {
    try {
      const data = await getSeances();
      setSeances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la liste des matières
  const fetchMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Récupérer la liste des appareils
  const fetchAppareils = async () => {
    try {
      const data = await getAppareils(); // <-- ajout
      setAppareils(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSeances();
    fetchMatieres();
    fetchAppareils(); // <-- ajout
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (data: any) => {
    const newErrors: any = {};
    if (!data.matiere_id) newErrors.matiere_id = "La matière est requise";
    if (!data.appareil_id) newErrors.appareil_id = "L'appareil est requis"; // <-- ajout
    if (!data.date_seance) newErrors.date_seance = "La date est requise";
    if (!data.heure_debut)
      newErrors.heure_debut = "L'heure de début est requise";
    if (!data.heure_fin) newErrors.heure_fin = "L'heure de fin est requise";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (data.seance_id) {
        await updateSeance(data.seance_id, data);
      } else {
        await createSeance(data);
      }

      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchSeances();
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data?.errors || {});
    }
  };

  // Supprimer une séance
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette séance ?")) return;

    try {
      await deleteSeance(id);
      fetchSeances();
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      alert(
        `Erreur lors de la suppression: ${
          err.response?.data?.error || err.message || "Erreur inconnue"
        }`
      );
    }
  };

  // Activer / désactiver une séance
  const handleToggleActive = async (seanceId: number) => {
    try {
      await toggleSeanceActive(seanceId);
      fetchSeances();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen h-full w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* En-tête de la page */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestion des Séances
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez et planifiez les séances de cours
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(initialFormData);
                setIsModalOpen(true);
                setErrors({});
              }}
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-semibold">Ajouter une séance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteneur principal avec la liste */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="h-full">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Chargement des séances...
                </p>
              </div>
            </div>
          ) : (
            <SeanceList
              seances={seances}
              onEdit={(s) => {
                setFormData({
                  ...s,
                  date_debut_initiale: s.date_seance,
                  heure_debut_initiale: s.heure_debut,
                });
                setIsModalOpen(true);
                setErrors({});
              }}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <SeanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setFormData(initialFormData);
          setIsModalOpen(false);
          setErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        errors={errors}
        setErrors={setErrors}
        matieres={matieres}
        appareils={appareils} // <-- ajout
      />
    </div>
  );
};

export default SeancePage;
