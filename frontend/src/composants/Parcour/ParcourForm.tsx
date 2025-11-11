import React from "react";

interface ParcoursFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
}

const ParcoursForm: React.FC<ParcoursFormProps> = ({
  formData,
  setFormData,
  errors,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du parcours *
        </label>
        <input
          type="text"
          value={formData.parcours_nom || ""}
          onChange={(e) =>
            setFormData({ ...formData, parcours_nom: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.parcours_nom ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.parcours_nom && (
          <p className="text-red-500 text-sm mt-1">{errors.parcours_nom}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {formData.parcours_id ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
};

export default ParcoursForm;
