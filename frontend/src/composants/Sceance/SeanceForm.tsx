import React from "react";

interface SeanceFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
  matieres: { matiere_id: number; matiere_nom: string }[]; // liste des matières
}

const SeanceForm: React.FC<SeanceFormProps> = ({
  formData,
  setFormData,
  errors,
  onSubmit,
  matieres,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {/* Matière */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Matière
        </label>
        <select
          value={formData.matiere_id || ""}
          onChange={(e) =>
            setFormData({ ...formData, matiere_id: Number(e.target.value) })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.matiere_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">-- Sélectionner une matière --</option>
          {matieres.map((matiere) => (
            <option key={matiere.matiere_id} value={matiere.matiere_id}>
              {matiere.matiere_nom}
            </option>
          ))}
        </select>
        {errors?.matiere_id && (
          <p className="text-red-500 text-sm mt-1">{errors.matiere_id}</p>
        )}
      </div>

      {/* Date de la séance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de la séance
        </label>
        <input
          type="date"
          value={formData.date_seance || ""}
          onChange={(e) =>
            setFormData({ ...formData, date_seance: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.date_seance ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.date_seance && (
          <p className="text-red-500 text-sm mt-1">{errors.date_seance}</p>
        )}
      </div>

      {/* Heure de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heure de début
        </label>
        <input
          type="time"
          value={formData.heure_debut || ""}
          onChange={(e) =>
            setFormData({ ...formData, heure_debut: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.heure_debut ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.heure_debut && (
          <p className="text-red-500 text-sm mt-1">{errors.heure_debut}</p>
        )}
      </div>

      {/* Heure de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heure de fin
        </label>
        <input
          type="time"
          value={formData.heure_fin || ""}
          onChange={(e) =>
            setFormData({ ...formData, heure_fin: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.heure_fin ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.heure_fin && (
          <p className="text-red-500 text-sm mt-1">{errors.heure_fin}</p>
        )}
      </div>

      {/* Bouton */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {formData.seance_id ? "Modifier la séance" : "Ajouter la séance"}
      </button>
    </form>
  );
};

export default SeanceForm;
