import React from "react";

interface ProfesseurFormProps {
  formData: any;
  setFormData: (data: any) => void;
  //   roles: any[];
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfesseurForm: React.FC<ProfesseurFormProps> = ({
  formData,
  setFormData,
  //   roles,
  errors,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom *
        </label>
        <input
          type="text"
          value={formData?.professeur_nom || ""}
          onChange={(e) =>
            setFormData({ ...formData, professeur_nom: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.professeur_nom ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.professeur_nom && (
          <p className="text-red-500 text-sm mt-1">{errors.professeur_nom}</p>
        )}
      </div>

      {/* Prénom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prénom *
        </label>
        <input
          type="text"
          value={formData?.professeur_prenom || ""}
          onChange={(e) =>
            setFormData({ ...formData, professeur_prenom: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.professeur_prenom ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.professeur_prenom && (
          <p className="text-red-500 text-sm mt-1">
            {errors.professeur_prenom}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData?.professeur_mail || ""}
          onChange={(e) =>
            setFormData({ ...formData, professeur_mail: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone
        </label>
        <input
          type="text"
          value={formData?.professeur_tel || ""}
          onChange={(e) =>
            setFormData({ ...formData, professeur_tel: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {formData?.professeur_id ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
};

export default ProfesseurForm;
