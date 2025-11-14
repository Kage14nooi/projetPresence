import React, { type ChangeEvent } from "react";
import { FileText } from "lucide-react";

interface Absence {
  absence_id: number;
  etudiant_nom: string;
  date_absence: string;
}

interface PieceFormProps {
  formData: {
    pieceJust_id?: number;
    absence_id?: number;
    motif?: "Maladie" | "Evénement familial" | "Autres";
    pieceJust_file?: File | string | null; // File pour nouvel upload, string pour existant
    pieceJust_description?: string;
    existing_file_name?: string;
  };
  setFormData: (data: any) => void;
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
  absences: Absence[];
}

const PieceForm: React.FC<PieceFormProps> = ({
  formData,
  setFormData,
  errors,
  onSubmit,
  absences,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pieceJust_file: e.target.files[0] });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-6 space-y-5 bg-white rounded-2xl shadow-lg"
    >
      {/* Select Absence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Absence *
        </label>
        <select
          value={formData.absence_id || ""}
          onChange={(e) =>
            setFormData({ ...formData, absence_id: Number(e.target.value) })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.absence_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Sélectionner une absence</option>
          {absences.map((absence) => (
            <option key={absence.absence_id} value={absence.absence_id}>
              {absence.etudiant_nom} - {absence.date_absence}
            </option>
          ))}
        </select>
        {errors?.absence_id && (
          <p className="text-red-500 text-sm mt-1">{errors.absence_id}</p>
        )}
      </div>

      {/* Motif */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motif *
        </label>
        <select
          value={formData.motif || ""}
          onChange={(e) =>
            setFormData({ ...formData, motif: e.target.value as any })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.motif ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Sélectionner un motif</option>
          <option value="Maladie">Maladie</option>
          <option value="Evénement familial">Evénement familial</option>
          <option value="Autres">Autres</option>
        </select>
        {errors?.motif && (
          <p className="text-red-500 text-sm mt-1">{errors.motif}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.pieceJust_description || ""}
          onChange={(e) =>
            setFormData({ ...formData, pieceJust_description: e.target.value })
          }
          rows={3}
          placeholder="Ajouter une description optionnelle..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.pieceJust_description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.pieceJust_description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pieceJust_description}
          </p>
        )}
      </div>

      {/* Fichier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" /> Fichier
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
        {/* Afficher fichier sélectionné ou existant */}
        {formData.pieceJust_file &&
          typeof formData.pieceJust_file === "object" && (
            <p className="text-gray-600 text-sm mt-1">
              Fichier sélectionné :{" "}
              <span className="font-medium">
                {formData.pieceJust_file.name}
              </span>
            </p>
          )}
        {!formData.pieceJust_file && formData.pieceJust_id && (
          <p className="text-gray-600 text-sm mt-1">
            Fichier actuel :{" "}
            <span className="font-medium">
              {formData.existing_file_name || "Aucun fichier"}
            </span>
          </p>
        )}
      </div>

      {/* Bouton */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
      >
        {formData.pieceJust_id ? "Modifier la pièce" : "Ajouter la pièce"}
      </button>
    </form>
  );
};

export default PieceForm;
