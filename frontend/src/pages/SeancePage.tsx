import React, { useEffect, useState } from "react";
import {
  getSeances,
  createSeance,
  updateSeance,
  deleteSeance,
  toggleSeanceActive, // <- ajoute cette fonction
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.matiere_id || !formData.date_seance) {
      setErrors({
        matiere_id: "La matière est requise",
        date_seance: "La date est requise",
      });
      return;
    }

    try {
      if (formData.seance_id) await updateSeance(formData.seance_id, formData);
      else await createSeance(formData);

      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchSeances();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette séance ?")) {
      await deleteSeance(id);
      fetchSeances();
    }
  };

  // ✅ Fonction pour activer/désactiver la séance
  const handleToggleActive = async (seanceId: number) => {
    try {
      await toggleSeanceActive(seanceId);
      fetchSeances(); // recharge la liste après le toggle
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
            setFormData(s);
            setIsModalOpen(true);
            setErrors({});
          }}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive} // <- ajouté
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
        onSubmit={handleSubmit}
        errors={errors}
        matieres={matieres}
      />
    </div>
  );
};

export default SeancePage;
