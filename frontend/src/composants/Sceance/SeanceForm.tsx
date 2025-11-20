import React from "react";

interface SeanceFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  setErrors: (data: any) => void;
  onSubmit: (data: any) => Promise<void>;
  matieres: { matiere_id: number; matiere_nom: string }[];
}

const SeanceForm: React.FC<SeanceFormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  matieres,
}) => {
  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: any = {};

    // Validation matière
    if (!formData.matiere_id) {
      newErrors.matiere_id = "La matière est requise";
    }

    // Validation date
    if (!formData.date_seance) {
      newErrors.date_seance = "La date est requise";
    } else {
      const selectedDate = new Date(formData.date_seance);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!formData.seance_id) {
        if (selectedDate.getTime() < today.getTime()) {
          newErrors.date_seance =
            "La date doit être aujourd'hui ou dans le futur";
        }
      } else {
        if (formData.date_debut_initiale) {
          const dateInitiale = new Date(formData.date_debut_initiale);
          dateInitiale.setHours(0, 0, 0, 0);

          if (dateInitiale.getTime() < today.getTime()) {
            if (selectedDate.getTime() < dateInitiale.getTime()) {
              newErrors.date_seance =
                "La date ne peut pas être avant la date de début de la séance";
            }
          } else {
            if (selectedDate.getTime() < today.getTime()) {
              newErrors.date_seance =
                "La date doit être aujourd'hui ou dans le futur";
            }
          }
        }
      }
    }

    // Validation heures obligatoires
    if (!formData.heure_debut) {
      newErrors.heure_debut = "L'heure de début est requise";
    }

    if (!formData.heure_fin) {
      newErrors.heure_fin = "L'heure de fin est requise";
    }

    // Validation logique heures seulement si les deux champs sont remplis
    if (formData.heure_debut && formData.heure_fin) {
      if (formData.heure_debut >= formData.heure_fin) {
        newErrors.heure_fin = "L'heure de fin doit être après l'heure de début";
      }

      if (formData.date_seance) {
        const selectedDate = new Date(formData.date_seance);
        selectedDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
          const now = new Date();
          const currentTime = `${now
            .getHours()
            .toString()
            .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

          if (!formData.seance_id) {
            if (formData.heure_debut < currentTime) {
              newErrors.heure_debut =
                "L'heure de début doit être dans le futur";
            }
          } else {
            if (formData.heure_debut_initiale) {
              const heureInitialePassee =
                formData.heure_debut_initiale < currentTime;

              if (heureInitialePassee) {
                if (
                  formData.heure_debut &&
                  formData.heure_debut < formData.heure_debut_initiale
                ) {
                  newErrors.heure_debut =
                    "L'heure ne peut pas être avant l'heure de début initiale";
                }
              } else {
                if (
                  formData.heure_debut &&
                  formData.heure_debut < currentTime
                ) {
                  newErrors.heure_debut =
                    "L'heure de début doit être dans le futur";
                }
              }
            }
          }
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleLocalSubmit} className="p-6 space-y-4">
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

      {/* Date */}
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
