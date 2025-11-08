import React, { useEffect, useState } from "react";
import {
  getEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "../services/etudiantService";
import { getRoles } from "../services/roleService";
import { getParcours } from "../services/parcoursService";
import EtudiantList from "../composants/Etudiant/EtudiantList";
import EtudiantModal from "../composants/Etudiant/EtudiantModal";
import { UserPlus, Users } from "lucide-react";

const initialFormData = {
  etudiant_id: null,
  etudiant_nom: "",
  etudiant_prenom: "",
  etudiant_matricule: "",
  etudiant_niveau: "",
  etudiant_parcours: "",
  etudiant_mail: "",
  etudiant_tel: "",
  role_id: "",
};

const EtudiantPage: React.FC = () => {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [parcours, setParcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des étudiants
  const fetchEtudiants = async () => {
    try {
      const data = await getEtudiants();
      setEtudiants(data);
    } catch (err) {
      console.error("Erreur fetch étudiants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des parcours
  const fetchParcours = async () => {
    try {
      const data = await getParcours();
      setParcours(data);
    } catch (err) {
      console.error("Erreur fetch parcours:", err);
    }
  };

  // Récupération des rôles
  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
      console.log("/n" + "mety:" + data);
    } catch (err) {
      console.error("Erreur fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchEtudiants();
    fetchRoles();
    fetchParcours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple côté frontend
    const newErrors: any = {};
    if (!formData.etudiant_nom) newErrors.etudiant_nom = "Le nom est requis";
    if (!formData.etudiant_prenom)
      newErrors.etudiant_prenom = "Le prénom est requis";
    if (!formData.etudiant_matricule)
      newErrors.etudiant_matricule = "Le matricule est requis";
    if (!formData.role_id) newErrors.role_id = "Le rôle est requis";
    if (!formData.etudiant_parcours)
      newErrors.etudiant_parcours = "Le parcours est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (formData.etudiant_id) {
        await updateEtudiant(formData.etudiant_id, formData);
      } else {
        await createEtudiant(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchEtudiants();
    } catch (err: any) {
      console.error(err);
      // setErrors(err.response?.data?.errors || {}); // Si backend renvoie des erreurs
    }
  };

  // Suppression étudiant
  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      await deleteEtudiant(id);
      fetchEtudiants();
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
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestion des Étudiants
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez et consultez la liste des étudiants inscrits
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
              <span className="font-semibold">Ajouter un étudiant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteneur principal avec la liste */}
      <div className="flex-1 overflow-auto  px-6 py-6">
        <div className="h-full">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Chargement des étudiants...
                </p>
              </div>
            </div>
          ) : (
            <EtudiantList
              etudiants={etudiants}
              onEdit={(e) => {
                setFormData(e);
                setIsModalOpen(true);
                setErrors({});
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <EtudiantModal
        isOpen={isModalOpen}
        onClose={() => {
          setFormData(initialFormData);
          setIsModalOpen(false);
          setErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        roles={roles}
        parcours={parcours}
        errors={errors}
      />
    </div>
  );
};

export default EtudiantPage;
