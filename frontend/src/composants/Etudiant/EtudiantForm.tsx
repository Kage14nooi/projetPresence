import React from "react";

interface Role {
  role_id: number;
  role_type: string;
}

interface Parcours {
  parcours_id: number;
  parcours_nom: string;
}

interface Niveau {
  niveau_id: number;
  niveau_nom: string;
}

interface Mention {
  mention_id: number;
  mention_nom: string;
}

interface EtudiantFormProps {
  formData: {
    etudiant_id?: number;
    etudiant_nom?: string;
    etudiant_prenom?: string;
    etudiant_matricule?: string;
    etudiant_mail?: string;
    etudiant_tel?: string;
    mention_id?: number;
    parcours_id?: number;
    niveau_id?: number;
    role_id?: number;
    device_user_id?: string | number;
  };
  setFormData: (data: any) => void;
  roles?: Role[];
  parcours?: Parcours[];
  niveaux?: Niveau[];
  mentions?: Mention[];
  errors?: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
}

const EtudiantForm: React.FC<EtudiantFormProps> = ({
  formData,
  setFormData,
  roles = [],
  parcours = [],
  niveaux = [],
  mentions = [],
  errors = {},
  onSubmit,
}) => {
  // 🔹 Vérifier les données reçues
  console.log("Niveaux:", niveaux);
  console.log("mentions:", mentions);
  console.log("Parcours:", parcours);
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {/* Matricule */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Matricule *
        </label>
        <input
          type="text"
          value={formData.etudiant_matricule || ""}
          onChange={(e) =>
            setFormData({ ...formData, etudiant_matricule: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors.etudiant_matricule ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.etudiant_matricule && (
          <p className="text-red-500 text-sm mt-1">
            {errors.etudiant_matricule}
          </p>
        )}
      </div>

      {/* Nom et Prénom */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={formData.etudiant_nom || ""}
            onChange={(e) =>
              setFormData({ ...formData, etudiant_nom: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.etudiant_nom ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.etudiant_nom && (
            <p className="text-red-500 text-sm mt-1">{errors.etudiant_nom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.etudiant_prenom || ""}
            onChange={(e) =>
              setFormData({ ...formData, etudiant_prenom: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.etudiant_prenom ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.etudiant_prenom && (
            <p className="text-red-500 text-sm mt-1">
              {errors.etudiant_prenom}
            </p>
          )}
        </div>
      </div>

      {/* Niveau, Mention et Parcours */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau *
          </label>
          <select
            value={formData.niveau_id ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                niveau_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.niveau_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((n) => (
              <option key={n.niveau_id} value={n.niveau_id}>
                {n.niveau_nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mention *
          </label>
          <select
            value={formData.mention_id ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                mention_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.mention_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner une mention</option>
            {mentions.map((m) => (
              <option key={m.mention_id} value={m.mention_id}>
                {m.mention_nom}
              </option>
            ))}
          </select>
          {errors.mention_id && (
            <p className="text-red-500 text-sm mt-1">{errors.mention_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parcours *
          </label>
          <select
            value={formData.parcours_id ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                parcours_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.parcours_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionner un parcours</option>
            {parcours.map((p) => (
              <option key={p.parcours_id} value={p.parcours_id}>
                {p.parcours_nom}
              </option>
            ))}
          </select>
          {errors.parcours_id && (
            <p className="text-red-500 text-sm mt-1">{errors.parcours_id}</p>
          )}
        </div>
      </div>

      {/* Email et Téléphone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.etudiant_mail || ""}
            onChange={(e) =>
              setFormData({ ...formData, etudiant_mail: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.etudiant_mail ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="text"
            value={formData.etudiant_tel || ""}
            onChange={(e) =>
              setFormData({ ...formData, etudiant_tel: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.etudiant_tel ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* Rôle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rôle *
        </label>
        <select
          value={formData.role_id ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              role_id: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors.role_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Sélectionner un rôle</option>
          {roles.map((r) => (
            <option key={r.role_id} value={r.role_id}>
              {r.role_type}
            </option>
          ))}
        </select>
        {errors.role_id && (
          <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
        )}
      </div>

      {/* Device User */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Device user
        </label>
        <input
          type="text"
          value={formData.device_user_id || ""}
          onChange={(e) =>
            setFormData({ ...formData, device_user_id: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors.device_user_id ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {formData.etudiant_id ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
};

export default EtudiantForm;
