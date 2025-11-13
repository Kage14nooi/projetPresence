import React from "react";
import EtudiantForm from "./EtudiantForm";

interface EtudiantModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  roles: any[];
  parcours: any[];
  mentions: any[];
  niveau: any[];
  errors: any;
}

const EtudiantModal: React.FC<EtudiantModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  roles,
  parcours,
  niveau,
  mentions,
  errors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {formData?.etudiant_id ? "Modifier Étudiant" : "Ajouter Étudiant"}
        </h2>
        <EtudiantForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          roles={roles}
          parcours={parcours}
          mentions={mentions}
          niveaux={niveau}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default EtudiantModal;
