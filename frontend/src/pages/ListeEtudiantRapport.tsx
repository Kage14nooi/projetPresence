import React, { useEffect, useState } from "react";
import {
  getEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "../services/etudiantService";
import { getRoles } from "../services/roleService";
import { getParcours } from "../services/parcoursService";
import { getNiveau } from "../services/NiveauService";
import { getMention } from "../services/MentionService";
import EtudiantListRapport from "../composants/Rapport/listeEtudiantRapport";
import EtudiantModal from "../composants/Etudiant/EtudiantModal";
import { UserPlus, Users } from "lucide-react";

const initialFormData = {
  etudiant_id: null,
  etudiant_nom: "",
  etudiant_prenom: "",
  etudiant_matricule: "",
  etudiant_mail: "",
  etudiant_tel: "",
  mention_id: "",
  parcours_id: "",
  niveau_id: "",
  role_id: "",
  device_user_id: "",
};

const EtudiantRapportPage: React.FC = () => {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [parcours, setParcours] = useState<any[]>([]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [niveau, setNiveau] = useState<any[]>([]);
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
  const fetchMentions = async () => {
    try {
      const data = await getMention();
      setMentions(data);
    } catch (err) {
      console.error("Erreur fetch parcours:", err);
    }
  };
  const fetchNiveau = async () => {
    try {
      const data = await getNiveau();
      setNiveau(data);
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
    fetchMentions();
    fetchNiveau();
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
    if (!formData.parcours_id) newErrors.parcours_id = "Le parcours est requis";
    if (!formData.niveau_id) newErrors.niveau_id = "Le niveau est requis";
    if (!formData.mention_id) newErrors.mention_id = "La mention est requise";

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
            <EtudiantListRapport
              etudiants={etudiants}
              niveaux={niveau}
              parcours={parcours}
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
        mentions={mentions}
        niveau={niveau}
        errors={errors}
      />
    </div>
  );
};

export default EtudiantRapportPage;
