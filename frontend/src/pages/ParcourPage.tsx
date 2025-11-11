import React, { useEffect, useState } from "react";
import {
  getParcours,
  createParcours,
  updateParcours,
  deleteParcours,
} from "../services/parcoursService";
import ParcoursList from "../composants/Parcour/ParcourList";
import ParcoursModal from "../composants/Parcour/ParcourModal";
import { UserPlus } from "lucide-react";

const initialFormData = { parcours_id: null, parcours_nom: "" };

const ParcoursPage: React.FC = () => {
  const [parcours, setParcours] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchParcours = async () => {
    try {
      const data = await getParcours();
      setParcours(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parcours_nom) {
      setErrors({ parcours_nom: "Le nom est requis" });
      return;
    }
    try {
      if (formData.parcours_id)
        await updateParcours(formData.parcours_id, formData);
      else await createParcours(formData);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchParcours();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce parcours ?")) {
      await deleteParcours(id);
      fetchParcours();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Parcours</h1>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsModalOpen(true);
            setErrors({});
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          <span>Ajouter un parcours</span>
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ParcoursList
          parcours={parcours}
          onEdit={(p) => {
            setFormData(p);
            setIsModalOpen(true);
            setErrors({});
          }}
          onDelete={handleDelete}
        />
      )}

      <ParcoursModal
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
      />
    </div>
  );
};

export default ParcoursPage;
