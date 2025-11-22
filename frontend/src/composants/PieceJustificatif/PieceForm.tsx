// import React, { useState, useRef, useEffect } from "react";
// import { FileText } from "lucide-react";

// interface Absence {
//   absence_id: number;
//   etudiant?: {
//     etudiant_nom: string;
//     etudiant_prenom: string;
//   };
//   seance?: {
//     date_seance: string;
//     matiere?: {
//       matiere_nom: string;
//     };
//   };
// }

// interface PieceFormProps {
//   formData: any;
//   setFormData: (data: any) => void;
//   errors: any;
//   onSubmit: (e: React.FormEvent) => void;
//   absences: Absence[];
// }

// const PieceForm: React.FC<PieceFormProps> = ({
//   formData,
//   setFormData,
//   errors,
//   onSubmit,
//   absences,
// }) => {
//   const [searchText, setSearchText] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filterMatiere, setFilterMatiere] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // 🔹 Extraire les matières uniques pour le select
//   const matieres = Array.from(
//     new Set(absences.map((a) => a.seance?.matiere?.matiere_nom).filter(Boolean))
//   );

//   // 🔹 Filtrer absences par nom, date et matière
//   const filteredAbsences = absences.filter((absence) => {
//     const fullName = `${absence.etudiant?.etudiant_nom ?? ""} ${
//       absence.etudiant?.etudiant_prenom ?? ""
//     }`.toLowerCase();
//     const matiereName = absence.seance?.matiere?.matiere_nom ?? "";
//     const matchName =
//       searchText === "" || fullName.includes(searchText.toLowerCase());
//     const matchDate =
//       filterDate === "" || absence.seance?.date_seance === filterDate;
//     const matchMatiere = filterMatiere === "" || matiereName === filterMatiere;
//     return matchName && matchDate && matchMatiere;
//   });

//   // 🔒 fermer dropdown si clique à l'extérieur
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (absence: Absence) => {
//     setFormData({ ...formData, absence_id: absence.absence_id });
//     setSearchText(
//       `${absence.etudiant?.etudiant_nom} ${absence.etudiant?.etudiant_prenom} — ${absence.seance?.matiere?.matiere_nom} — ${absence.seance?.date_seance}`
//     );
//     setDropdownOpen(false);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, pieceJust_file: e.target.files[0] });
//     }
//   };

//   return (
//     <form
//       onSubmit={onSubmit}
//       className="p-6 space-y-5 bg-white rounded-2xl shadow-lg"
//     >
//       {/* Champ Autocomplete Absence */}
//       <div ref={dropdownRef} className="relative">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Absence *
//         </label>
//         {/* Filtrer par matière (liste déroulante) */}
//         <select
//           value={filterMatiere}
//           onChange={(e) => setFilterMatiere(e.target.value)}
//           className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
//         >
//           <option value="">Toutes les matières</option>
//           {matieres.map((matiere) => (
//             <option key={matiere} value={matiere}>
//               {matiere}
//             </option>
//           ))}
//         </select>

//         {/* Filtrer par date */}
//         <input
//           type="date"
//           value={filterDate}
//           onChange={(e) => setFilterDate(e.target.value)}
//           className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
//         />
//         {/* Recherche par nom */}
//         <input
//           type="text"
//           value={searchText}
//           onChange={(e) => {
//             setSearchText(e.target.value);
//             setDropdownOpen(true);
//           }}
//           onClick={() => setDropdownOpen(true)}
//           placeholder="Tapez un nom ou sélectionnez"
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors?.absence_id ? "border-red-500" : "border-gray-300"
//           }`}
//         />

//         {/* Liste déroulante */}
//         {dropdownOpen && (
//           <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//             {filteredAbsences.length > 0 ? (
//               filteredAbsences.map((absence) => (
//                 <div
//                   key={absence.absence_id}
//                   onClick={() => handleSelect(absence)}
//                   className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
//                 >
//                   {absence.etudiant?.etudiant_nom}{" "}
//                   {absence.etudiant?.etudiant_prenom}
//                   {/* {absence.seance?.matiere?.matiere_nom} —{" "} */}
//                   {/* {absence.seance?.date_seance} */}
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-2 text-gray-500">
//                 Aucune absence trouvée
//               </div>
//             )}
//           </div>
//         )}

//         {errors?.absence_id && (
//           <p className="text-red-500 text-sm mt-1">{errors.absence_id}</p>
//         )}
//       </div>

//       {/* Motif */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Motif *
//         </label>
//         <select
//           value={formData.motif || ""}
//           onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors?.motif ? "border-red-500" : "border-gray-300"
//           }`}
//         >
//           <option value="">Sélectionner un motif</option>
//           <option value="Maladie">Maladie</option>
//           <option value="Evénement familial">Evénement familial</option>
//           <option value="Autres">Autres</option>
//         </select>
//       </div>

//       {/* Description */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description
//         </label>
//         <textarea
//           value={formData.pieceJust_description || ""}
//           onChange={(e) =>
//             setFormData({ ...formData, pieceJust_description: e.target.value })
//           }
//           rows={3}
//           placeholder="Ajouter une description..."
//           className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
//         />
//       </div>

//       {/* Fichier */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//           <FileText className="w-5 h-5 text-blue-500" /> Fichier
//         </label>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
//         />
//       </div>

//       {/* Bouton */}
//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
//       >
//         {formData.pieceJust_id ? "Modifier la pièce" : "Ajouter la pièce"}
//       </button>
//     </form>
//   );
// };

// export default PieceForm;

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Search,
  Calendar,
  BookOpen,
  User,
  AlertCircle,
  Upload,
  X,
  Check,
} from "lucide-react";

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
  const [fileName, setFileName] = useState("");
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
      `${absence.etudiant?.etudiant_nom} ${absence.etudiant?.etudiant_prenom}`
    );
    setDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, pieceJust_file: file });
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, pieceJust_file: null });
    setFileName("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6"
    >
      {/* En-tête du formulaire */}
      {/* <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-4 -mx-6 -mt-6 mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          {formData.pieceJust_id
            ? "Modifier la pièce justificative"
            : "Ajouter une pièce justificative"}
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Remplissez les informations ci-dessous
        </p>
      </div> */}

      {/* Section Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-600" />
          Filtres de recherche
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Filtrer par matière */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              Matière
            </label>
            <select
              value={filterMatiere}
              onChange={(e) => setFilterMatiere(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white transition-all"
            >
              <option value="">Toutes les matières</option>
              {matieres.map((matiere) => (
                <option key={matiere} value={matiere}>
                  {matiere}
                </option>
              ))}
            </select>
          </div>

          {/* Filtrer par date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Champ Autocomplete Absence */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          Sélectionner une absence
          <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDropdownOpen(true);
            }}
            onClick={() => setDropdownOpen(true)}
            placeholder="Rechercher un étudiant..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
              errors?.absence_id
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          />
        </div>

        {/* Liste déroulante */}
        {dropdownOpen && (
          <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {filteredAbsences.length > 0 ? (
              <div className="p-1">
                {filteredAbsences.map((absence) => (
                  <div
                    key={absence.absence_id}
                    onClick={() => handleSelect(absence)}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm group-hover:shadow-md transition-all">
                      {absence.etudiant?.etudiant_prenom?.[0]}
                      {absence.etudiant?.etudiant_nom?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {absence.etudiant?.etudiant_nom}{" "}
                        {absence.etudiant?.etudiant_prenom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {absence.seance?.matiere?.matiere_nom} •{" "}
                        {new Date(
                          absence.seance?.date_seance || ""
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune absence trouvée</p>
              </div>
            )}
          </div>
        )}

        {errors?.absence_id && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.absence_id}
          </p>
        )}
      </div>

      {/* Motif */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-600" />
          Motif
          <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.motif || ""}
          onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
            errors?.motif
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <option value="">Sélectionner un motif</option>
          <option value="Maladie">🏥 Maladie</option>
          <option value="Evénement familial">👨‍👩‍👧‍👦 Evénement familial</option>
          <option value="Autres">📋 Autres</option>
        </select>
        {errors?.motif && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.motif}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          Description
        </label>
        <textarea
          value={formData.pieceJust_description || ""}
          onChange={(e) =>
            setFormData({ ...formData, pieceJust_description: e.target.value })
          }
          rows={4}
          placeholder="Décrivez la raison de l'absence..."
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white transition-all resize-none"
        />
      </div>

      {/* Fichier */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-600" />
          Fichier justificatif
        </label>

        {!fileName ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-2 group-hover:text-indigo-600 transition-colors" />
              <p className="mb-1 text-sm text-gray-600 font-medium">
                <span className="text-indigo-600">
                  Cliquez pour télécharger
                </span>{" "}
                ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG (max. 10MB)</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName}
              </p>
              <p className="text-xs text-gray-500">Fichier sélectionné</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bouton de soumission */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
        >
          <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {formData.pieceJust_id ? "Modifier la pièce" : "Ajouter la pièce"}
        </button>
      </div>
    </form>
  );
};

export default PieceForm;
