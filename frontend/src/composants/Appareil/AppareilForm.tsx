import React from "react";

export interface Appareil {
  appareil_id: number | null;
  appareil_nom: string;
  appareil_serie: string;
}

interface AppareilFormProps {
  formData: Appareil;
  setFormData: (data: Appareil) => void;
  onSubmit: () => void;
  errors: any;
}

const AppareilForm: React.FC<AppareilFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  errors,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Nom de l'appareil
        </label>
        <input
          type="text"
          value={formData.appareil_nom}
          onChange={(e) =>
            setFormData({ ...formData, appareil_nom: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.appareil_nom && (
          <span className="text-red-500 text-sm">{errors.appareil_nom}</span>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Numéro de série
        </label>
        <input
          type="text"
          value={formData.appareil_serie}
          onChange={(e) =>
            setFormData({ ...formData, appareil_serie: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.appareil_serie && (
          <span className="text-red-500 text-sm">{errors.appareil_serie}</span>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        {formData.appareil_id ? "Modifier Appareil" : "Ajouter Appareil"}
      </button>
    </form>
  );
};

export default AppareilForm;
