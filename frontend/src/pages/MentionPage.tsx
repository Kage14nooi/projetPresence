import React, { useEffect, useState } from "react";
import {
  getMention,
  createMention,
  updateMention,
  deleteMention,
} from "../services/MentionService";
import MentionList from "../composants/Mention/MentionList";
import MentionModal from "../composants/Mention/MentionModal";
import { UserPlus } from "lucide-react";

const initialFormData = { mention_id: null, mention_nom: "" };

const MentionPage: React.FC = () => {
  const [mention, setMention] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchMention = async () => {
    try {
      const data = await getMention();
      setMention(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMention();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mention_nom) {
      setErrors({ mention_nom: "Le nom est requis" });
      return;
    }
    try {
      if (formData.mention_id)
        await updateMention(formData.mention_id, formData);
      else await createMention(formData);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchMention();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce Mention ?")) {
      await deleteMention(id);
      fetchMention();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Mention</h1>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsModalOpen(true);
            setErrors({});
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          <span>Ajouter un Mention</span>
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <MentionList
          mention={mention}
          onEdit={(p) => {
            setFormData(p);
            setIsModalOpen(true);
            setErrors({});
          }}
          onDelete={handleDelete}
        />
      )}

      <MentionModal
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

export default MentionPage;
