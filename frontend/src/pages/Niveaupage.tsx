import React, { useEffect, useState } from "react";
import {
  getNiveau,
  createNiveau,
  updateNiveau,
  deleteNiveau,
} from "../services/NiveauService";
import NiveauList from "../composants/Niveau/NiveauList";
import NiveauModal from "../composants/Niveau/NiveauModal";
import { UserPlus, BookOpen } from "lucide-react";

const initialFormData = { niveau_id: null, niveau_nom: "" };

const NiveauPage: React.FC = () => {
  const [niveau, setNiveau] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchNiveau = async () => {
    try {
      const data = await getNiveau();
      setNiveau(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiveau();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.niveau_nom) {
      setErrors({ niveau_nom: "Le nom est requis" });
      return;
    }
    try {
      if (formData.niveau_id) await updateNiveau(formData.niveau_id, formData);
      else await createNiveau(formData);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchNiveau();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce niveau ?")) {
      await deleteNiveau(id);
      fetchNiveau();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 p-6">
      {/* Header avec style gradient et icône */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestion des Niveaux
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez et consultez la liste des niveaux
          </p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => {
              setFormData(initialFormData);
              setIsModalOpen(true);
              setErrors({});
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-5 h-5" />
            <span>Ajouter un Niveau</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <NiveauList
          niveau={niveau}
          onEdit={(p) => {
            setFormData(p);
            setIsModalOpen(true);
            setErrors({});
          }}
          onDelete={handleDelete}
        />
      )}

      <NiveauModal
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

export default NiveauPage;
