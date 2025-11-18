import React, { useState, useRef, useEffect } from "react";
import { FileText } from "lucide-react";

interface Absence {
  absence_id: number;
  etudiant?: {
    etudiant_nom: string;
    etudiant_prenom: string;
  };
  seance?: {
    date_seance: string;
    matiere?: {
      matiere_nom: string;
    };
  };
}

interface PieceFormProps {
  formData: any;
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
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMatiere, setFilterMatiere] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔹 Extraire les matières uniques pour le select
  const matieres = Array.from(
    new Set(absences.map((a) => a.seance?.matiere?.matiere_nom).filter(Boolean))
  );

  // 🔹 Filtrer absences par nom, date et matière
  const filteredAbsences = absences.filter((absence) => {
    const fullName = `${absence.etudiant?.etudiant_nom ?? ""} ${
      absence.etudiant?.etudiant_prenom ?? ""
    }`.toLowerCase();
    const matiereName = absence.seance?.matiere?.matiere_nom ?? "";
    const matchName =
      searchText === "" || fullName.includes(searchText.toLowerCase());
    const matchDate =
      filterDate === "" || absence.seance?.date_seance === filterDate;
    const matchMatiere = filterMatiere === "" || matiereName === filterMatiere;
    return matchName && matchDate && matchMatiere;
  });

  // 🔒 fermer dropdown si clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (absence: Absence) => {
    setFormData({ ...formData, absence_id: absence.absence_id });
    setSearchText(
      `${absence.etudiant?.etudiant_nom} ${absence.etudiant?.etudiant_prenom} — ${absence.seance?.matiere?.matiere_nom} — ${absence.seance?.date_seance}`
    );
    setDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pieceJust_file: e.target.files[0] });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-6 space-y-5 bg-white rounded-2xl shadow-lg"
    >
      {/* Champ Autocomplete Absence */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Absence *
        </label>
        {/* Filtrer par matière (liste déroulante) */}
        <select
          value={filterMatiere}
          onChange={(e) => setFilterMatiere(e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
        >
          <option value="">Toutes les matières</option>
          {matieres.map((matiere) => (
            <option key={matiere} value={matiere}>
              {matiere}
            </option>
          ))}
        </select>

        {/* Filtrer par date */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
        {/* Recherche par nom */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setDropdownOpen(true);
          }}
          onClick={() => setDropdownOpen(true)}
          placeholder="Tapez un nom ou sélectionnez"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.absence_id ? "border-red-500" : "border-gray-300"
          }`}
        />

        {/* Liste déroulante */}
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredAbsences.length > 0 ? (
              filteredAbsences.map((absence) => (
                <div
                  key={absence.absence_id}
                  onClick={() => handleSelect(absence)}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                >
                  {absence.etudiant?.etudiant_nom}{" "}
                  {absence.etudiant?.etudiant_prenom}
                  {/* {absence.seance?.matiere?.matiere_nom} —{" "} */}
                  {/* {absence.seance?.date_seance} */}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                Aucune absence trouvée
              </div>
            )}
          </div>
        )}

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
          onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors?.motif ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Sélectionner un motif</option>
          <option value="Maladie">Maladie</option>
          <option value="Evénement familial">Evénement familial</option>
          <option value="Autres">Autres</option>
        </select>
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
          placeholder="Ajouter une description..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
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
