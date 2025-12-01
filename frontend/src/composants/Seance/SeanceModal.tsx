import React from "react";
import SeanceForm from "./SeanceForm";
import { type Appareil } from "../../services/appareilService";

interface SeanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (data: any) => Promise<void>;
  errors: any;
  setErrors: (data: any) => void;
  matieres: { matiere_id: number; matiere_nom: string }[];
  appareils: Appareil[]; // <-- corrigé
}

const SeanceModal: React.FC<SeanceModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  errors,
  setErrors,
  matieres,
  appareils,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-xl hover:text-gray-800"
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
          setErrors={setErrors}
          matieres={matieres}
          appareils={appareils} // <-- correct maintenant
        />
      </div>
    </div>
  );
};

export default SeanceModal;
