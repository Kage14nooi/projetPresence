import React from "react";

interface MatiereFormProps {
  formData: any;
  setFormData: (data: any) => void;
  professeurs: any[];
  parcours: any[];
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
}

const MatiereForm: React.FC<MatiereFormProps> = ({
  formData,
  setFormData,
  professeurs,
  parcours,
  errors,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {/* Nom de la matière */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom de la matière *
        </label>
        <input
          type="text"
          value={formData?.matiere_nom || ""}
          onChange={(e) =>
            setFormData({ ...formData, matiere_nom: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.matiere_nom ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.matiere_nom && (
          <p className="text-red-500 text-sm mt-1">{errors.matiere_nom}</p>
        )}
      </div>

      {/* Heure début et fin */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure début *
          </label>
          <input
            type="time"
            value={formData?.matiere_heureDebut || ""}
            onChange={(e) =>
              setFormData({ ...formData, matiere_heureDebut: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.matiere_heureDebut ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.matiere_heureDebut && (
            <p className="text-red-500 text-sm mt-1">
              {errors.matiere_heureDebut}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure fin *
          </label>
          <input
            type="time"
            value={formData?.matiere_heureFin || ""}
            onChange={(e) =>
              setFormData({ ...formData, matiere_heureFin: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.matiere_heureFin ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.matiere_heureFin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.matiere_heureFin}
            </p>
          )}
        </div>
      </div>

      {/* Professeur et Parcours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professeur *
          </label>
          <select
            value={formData?.professeur_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, professeur_id: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.professeur_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner un professeur</option>
            {professeurs.map((p) => (
              <option key={p.professeur_id} value={p.professeur_id}>
                {p.professeur_nom} {p.professeur_prenom}
              </option>
            ))}
          </select>
          {errors?.professeur_id && (
            <p className="text-red-500 text-sm mt-1">{errors.professeur_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parcours *
          </label>
          <select
            value={formData?.parcours_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, parcours_id: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.parcours_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner un parcours</option>
            {parcours.map((p) => (
              <option key={p.parcours_id} value={p.parcours_id}>
                {p.parcours_nom}
              </option>
            ))}
          </select>
          {errors?.parcours_id && (
            <p className="text-red-500 text-sm mt-1">{errors.parcours_id}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {formData?.matiere_id ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
};

export default MatiereForm;
