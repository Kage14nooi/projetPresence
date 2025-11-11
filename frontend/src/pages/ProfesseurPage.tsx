import React, { useEffect, useState } from "react";
import {
  getProfesseurs,
  createProfesseur,
  updateProfesseur,
  deleteProfesseur,
} from "../services/ProfesseurService";
// import { getRoles } from "../services/roleService";
import ProfesseurList from "../composants/Professeur/ProfesseurList";
import ProfesseurModal from "../composants/Professeur/ProfesseurModal";
import { UserPlus, Users } from "lucide-react";

const initialFormData = {
  professeur_id: null,
  professeur_nom: "",
  professeur_prenom: "",
  professeur_mail: "",
  professeur_tel: "",
  //   role_id: "",
};

const ProfesseurPage: React.FC = () => {
  const [professeurs, setProfesseurs] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [roles, setRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchProfesseurs = async () => {
    try {
      const data = await getProfesseurs();
      setProfesseurs(data);
    } catch (err) {
      console.error("Erreur fetch professeurs:", err);
    } finally {
      setLoading(false);
    }
  };

  //   const fetchRoles = async () => {
  //     try {
  //       const data = await getRoles();
  //       setRoles(data);
  //     } catch (err) {
  //       console.error("Erreur fetch roles:", err);
  //     }
  //   };

  useEffect(() => {
    fetchProfesseurs();
    // fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.professeur_nom)
      newErrors.professeur_nom = "Le nom est requis";
    if (!formData.professeur_prenom)
      newErrors.professeur_prenom = "Le prénom est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (formData.professeur_id) {
        await updateProfesseur(formData.professeur_id, formData);
      } else {
        await createProfesseur(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchProfesseurs();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
      await deleteProfesseur(id);
      fetchProfesseurs();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestion des Professeurs
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez et consultez la liste des professeurs inscrits
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
            <span className="font-semibold">Ajouter un professeur</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Chargement des professeurs...
              </p>
            </div>
          </div>
        ) : (
          <ProfesseurList
            professeurs={professeurs}
            onEdit={(e) => {
              setFormData(e);
              setIsModalOpen(true);
              setErrors({});
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ProfesseurModal
        isOpen={isModalOpen}
        onClose={() => {
          setFormData(initialFormData);
          setIsModalOpen(false);
          setErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        // roles={roles}
        errors={errors}
      />
    </div>
  );
};

export default ProfesseurPage;
