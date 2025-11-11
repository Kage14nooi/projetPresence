import React from "react";
import MatiereForm from "./MatiereForm";

interface MatiereModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  professeurs: any[];
  parcours: any[];
  errors: any;
}

const MatiereModal: React.FC<MatiereModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  professeurs,
  parcours,
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
          {formData?.matiere_id ? "Modifier Matière" : "Ajouter Matière"}
        </h2>
        <MatiereForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          professeurs={professeurs}
          parcours={parcours}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default MatiereModal;
