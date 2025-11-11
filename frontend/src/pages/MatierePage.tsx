import React, { useEffect, useState } from "react";
import {
  getMatieres,
  createMatiere,
  updateMatiere,
  deleteMatiere,
} from "../services/MatiereService";
import { getProfesseurs } from "../services/ProfesseurService";
import { getParcours } from "../services/parcoursService";
import MatiereList from "../composants/Matiere/MatiereList";
import MatiereModal from "../composants/Matiere/MatiereModal";
import { UserPlus, BookOpen } from "lucide-react";

const initialFormData = {
  matiere_id: null,
  matiere_nom: "",
  matiere_heureDebut: "",
  matiere_heureFin: "",
  professeur_id: "",
  parcours_id: "",
};

const MatierePage: React.FC = () => {
  const [matieres, setMatieres] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professeurs, setProfesseurs] = useState<any[]>([]);
  const [parcours, setParcours] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const data = await getProfesseurs();
      setProfesseurs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParcours = async () => {
    try {
      const data = await getParcours();
      setParcours(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatieres();
    fetchProfesseurs();
    fetchParcours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.matiere_nom) newErrors.matiere_nom = "Le nom est requis";
    if (!formData.matiere_heureDebut)
      newErrors.matiere_heureDebut = "L'heure de début est requise";
    if (!formData.matiere_heureFin)
      newErrors.matiere_heureFin = "L'heure de fin est requise";
    if (!formData.professeur_id)
      newErrors.professeur_id = "Le professeur est requis";
    if (!formData.parcours_id) newErrors.parcours_id = "Le parcours est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (formData.matiere_id) {
        await updateMatiere(formData.matiere_id, formData);
      } else {
        await createMatiere(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchMatieres();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette matière ?")) {
      await deleteMatiere(id);
      fetchMatieres();
    }
  };

  return (
    <div className="h-screen h-full w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestion des Matières
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez et consultez la liste des matières
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
            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Ajouter une matière</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Chargement des matières...
              </p>
            </div>
          </div>
        ) : (
          <MatiereList
            matieres={matieres}
            onEdit={(e) => {
              setFormData(e);
              setIsModalOpen(true);
              setErrors({});
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      <MatiereModal
        isOpen={isModalOpen}
        onClose={() => {
          setFormData(initialFormData);
          setIsModalOpen(false);
          setErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        professeurs={professeurs}
        parcours={parcours}
        errors={errors}
      />
    </div>
  );
};

export default MatierePage;
