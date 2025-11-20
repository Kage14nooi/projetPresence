import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getProfesseurs,
  createProfesseur,
  updateProfesseur,
  deleteProfesseur,
} from "../services/ProfesseurService";
import ProfesseurList from "../composants/Professeur/ProfesseurList";
import ProfesseurModal from "../composants/Professeur/ProfesseurModal";
import ConfirmationModal from "../composants/Modal/Confirmation";
import { UserPlus, Users } from "lucide-react";

const initialFormData = {
  professeur_id: null,
  professeur_nom: "",
  professeur_prenom: "",
  professeur_mail: "",
  professeur_tel: "",
};

const ProfesseurPage: React.FC = () => {
  const [professeurs, setProfesseurs] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [professeurToDelete, setProfesseurToDelete] = useState<number | null>(
    null
  );
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [formDataToUpdate, setFormDataToUpdate] = useState<any>(null);

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

  useEffect(() => {
    fetchProfesseurs();
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

    if (formData.professeur_id) {
      // modification → ouvrir modal de confirmation
      setFormDataToUpdate(formData);
      setIsUpdateConfirmOpen(true);
      setIsModalOpen(false);
    } else {
      // création directe
      try {
        await createProfesseur(formData);
        setIsModalOpen(false);
        setFormData(initialFormData);
        setErrors({});
        fetchProfesseurs();
        toast.success("Séance ajoutée avec succès !");
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleDelete = (id: number) => {
    setProfesseurToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    console.log("confirmDelete called");
    console.log("professeurToDelete:", professeurToDelete);

    if (professeurToDelete === null) {
      console.warn("Aucun professeur sélectionné pour suppression");
      return;
    }

    try {
      console.log("Appel à deleteProfesseur...");
      const response = await deleteProfesseur(professeurToDelete);
      console.log("deleteProfesseur response:", response);

      // Mise à jour locale de la liste
      setProfesseurs((prev) =>
        prev.filter((p) => p.professeur_id !== professeurToDelete)
      );
      toast.success("Le professeur a été supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    } finally {
      setIsConfirmOpen(false);
      setProfesseurToDelete(null);
    }
  };
  const confirmUpdate = async () => {
    if (!formDataToUpdate) return;

    try {
      await updateProfesseur(formDataToUpdate.professeur_id, formDataToUpdate);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchProfesseurs();
      toast.success("Séance modifiée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
    } finally {
      setIsUpdateConfirmOpen(false);
      setFormDataToUpdate(null);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
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

      {/* LIST */}
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
            onDelete={handleDelete} // ← déclenche le modal
          />
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isUpdateConfirmOpen}
        type="info"
        title="Modifier le professeur"
        message="Voulez-vous vraiment enregistrer les modifications pour ce professeur ?"
        confirmText="Modifier"
        cancelText="Annuler"
        onConfirm={confirmUpdate}
        onCancel={() => setIsUpdateConfirmOpen(false)}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        type="danger"
        title="Supprimer le professeur"
        message="Voulez-vous vraiment supprimer ce professeur ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete} // ← fonction corrigée
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* FORM MODAL */}
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
        errors={errors}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProfesseurPage;
