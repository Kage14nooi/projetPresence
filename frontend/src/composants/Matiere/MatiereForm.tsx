import React from "react";

interface MatiereFormProps {
  formData: any;
  setFormData: (data: any) => void;
  professeurs: any[];
  parcours: any[];
  mentions: any[];
  niveaux: any[];
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
}

const MatiereForm: React.FC<MatiereFormProps> = ({
  formData,
  setFormData,
  professeurs,
  parcours,
  mentions,
  niveaux,
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

      {/* Professeur, Parcours, Mention et Niveau */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professeur *
          </label>
          <select
            value={formData?.professeur_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                professeur_id: parseInt(e.target.value),
              })
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
              setFormData({
                ...formData,
                parcours_id: parseInt(e.target.value),
              })
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mention
          </label>
          <select
            value={formData?.mention_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, mention_id: parseInt(e.target.value) })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.mention_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner une mention</option>
            {mentions.map((m) => (
              <option key={m.mention_id} value={m.mention_id}>
                {m.mention_nom}
              </option>
            ))}
          </select>
          {errors?.mention_id && (
            <p className="text-red-500 text-sm mt-1">{errors.mention_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau *
          </label>
          <select
            value={formData?.niveau_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, niveau_id: parseInt(e.target.value) })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors?.niveau_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((n) => (
              <option key={n.niveau_id} value={n.niveau_id}>
                {n.niveau_nom}
              </option>
            ))}
          </select>
          {errors?.niveau_id && (
            <p className="text-red-500 text-sm mt-1">{errors.niveau_id}</p>
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
