import React, { useEffect, useState } from "react";
import {
  getSeances,
  createSeance,
  updateSeance,
  deleteSeance,
  toggleSeanceActive,
} from "../services/SeanceService";

import { UserPlus } from "lucide-react";
import { getMatieres } from "../services/MatiereService";
import SeanceList from "../composants/Sceance/SeanceList";
import SeanceModal from "../composants/Sceance/SeanceModal";

const initialFormData = {
  seance_id: null,
  matiere_id: "",
  date_seance: "",
  heure_debut: "",
  heure_fin: "",
};

const SeancePage: React.FC = () => {
  const [seances, setSeances] = useState<any[]>([]);
  const [matieres, setMatieres] = useState<any[]>([]);
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

  useEffect(() => {
    fetchSeances();
    fetchMatieres();
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (data: any) => {
    if (!data.matiere_id || !data.date_seance) {
      setErrors({
        matiere_id: "La matière est requise",
        date_seance: "La date est requise",
      });
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
    } catch (err) {
      console.error(err);
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
    <div className="h-full w-full flex flex-col bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Séances</h1>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsModalOpen(true);
            setErrors({});
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          <span>Ajouter une Séance</span>
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <SeanceList
          seances={seances}
          matieres={matieres}
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

      <SeanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setFormData(initialFormData);
          setIsModalOpen(false);
          setErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit} // <-- reçoit directement les données
        errors={errors}
        setErrors={setErrors}
        matieres={matieres}
      />
    </div>
  );
};

export default SeancePage;
