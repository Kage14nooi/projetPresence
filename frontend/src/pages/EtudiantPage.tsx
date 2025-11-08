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

  // Récupération des étudiants
  const fetchEtudiants = async () => {
    try {
      const data = await getEtudiants();
      setEtudiants(data);
    } catch (err) {
      console.error("Erreur fetch étudiants:", err);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Étudiants</h1>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsModalOpen(true);
            setErrors({});
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Ajouter
        </button>
      </div>

      <EtudiantList
        etudiants={etudiants}
        onEdit={(e) => {
          setFormData(e);
          setIsModalOpen(true);
          setErrors({});
        }}
        onDelete={handleDelete}
      />

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
