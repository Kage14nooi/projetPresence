import React from "react";
import type { Appareil } from "./AppareilForm";
import AppareilForm from "./AppareilForm";

interface AppareilModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Appareil;
  setFormData: (data: Appareil) => void;
  onSubmit: () => void;
  errors: any;
}

const AppareilModal: React.FC<AppareilModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
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
          {formData.appareil_id ? "Modifier Appareil" : "Ajouter Appareil"}
        </h2>
        <AppareilForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default AppareilModal;
