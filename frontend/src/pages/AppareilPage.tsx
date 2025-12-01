import React, { useEffect, useState } from "react";
import AppareilList from "../composants/Appareil/AppareilList";
import AppareilModal from "../composants/Appareil/AppareilModal";
import { UserPlus, Monitor } from "lucide-react";
import {
  getAppareils,
  createAppareil,
  updateAppareil,
  deleteAppareil,
} from "../services/appareilService";
import type { Appareil } from "../composants/Appareil/AppareilForm";

const initialFormData: Appareil = {
  appareil_id: null,
  appareil_nom: "",
  appareil_serie: "",
};

const AppareilPage: React.FC = () => {
  const [appareils, setAppareils] = useState<Appareil[]>([]);
  const [formData, setFormData] = useState<Appareil>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchAppareils = async () => {
    try {
      const data = await getAppareils();
      // Transformation pour respecter le type Appareil
      const appareilsFromApi = data.map((a: any) => ({
        appareil_id: a.appareil_id,
        appareil_nom: a.appareil_nom,
        appareil_serie: a.appareil_serie || "",
      }));
      setAppareils(appareilsFromApi);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppareils();
  }, []);
  const handleSubmit = async () => {
    if (!formData.appareil_nom || !formData.appareil_serie) {
      setErrors({
        appareil_nom: formData.appareil_nom ? "" : "Nom requis",
        appareil_serie: formData.appareil_serie ? "" : "Série requise",
      });
      return;
    }
    try {
      if (formData.appareil_id)
        await updateAppareil(formData.appareil_id, formData);
      else await createAppareil(formData);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchAppareils();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet appareil ?")) {
      await deleteAppareil(id);
      fetchAppareils();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 p-6">
      {/* Header avec style gradient et icône */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
          <Monitor className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestion des Appareils
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez et consultez la liste des appareils
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
            <span>Ajouter un Appareil</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <AppareilList
          appareils={appareils}
          onEdit={(appareil) => {
            setFormData(appareil);
            setIsModalOpen(true);
            setErrors({});
          }}
          onDelete={handleDelete}
        />
      )}

      <AppareilModal
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

export default AppareilPage;
