import React from "react";
import SeanceForm from "./SeanceForm";

interface SeanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: any;
  matieres: any[]; // liste des matières pour le select
}

const SeanceModal: React.FC<SeanceModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  errors,
  matieres,
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
          {formData.seance_id ? "Modifier Séance" : "Ajouter Séance"}
        </h2>
        <SeanceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          errors={errors}
          matieres={matieres}
        />
      </div>
    </div>
  );
};

export default SeanceModal;
