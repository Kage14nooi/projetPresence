import React from "react";
import PieceForm from "./PieceForm";

interface PieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: any;
  absences: any[];
}

const PieceModal: React.FC<PieceModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  errors,
  absences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-xl hover:text-gray-800"
        >
          ✖
        </button>

        {/* Titre */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {formData.pieceJust_id
            ? "Modifier Pièce Justificative"
            : "Ajouter Pièce Justificative"}
        </h2>

        {/* Formulaire */}
        <PieceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          errors={errors}
          absences={absences}
        />
      </div>
    </div>
  );
};

export default PieceModal;
