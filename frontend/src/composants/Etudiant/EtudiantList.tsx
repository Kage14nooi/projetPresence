import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface EtudiantListProps {
  etudiants: any[];
  onEdit: (etudiant: any) => void;
  onDelete: (id: number) => void;
}

const EtudiantList: React.FC<EtudiantListProps> = ({
  etudiants,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Matricule
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Nom</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Prénom
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Niveau
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Parcours
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Téléphone
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {etudiants.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-6 text-center text-gray-500">
                Aucun étudiant trouvé
              </td>
            </tr>
          ) : (
            etudiants.map((e, i) => (
              <tr key={e.etudiant_id} className={i % 2 ? "bg-gray-50" : ""}>
                <td className="px-4 py-3">{e.etudiant_matricule}</td>
                <td className="px-4 py-3">{e.etudiant_nom}</td>
                <td className="px-4 py-3">{e.etudiant_prenom}</td>
                <td className="px-4 py-3">{e.etudiant_niveau}</td>
                <td className="px-4 py-3">{e.etudiant_parcours}</td>
                <td className="px-4 py-3">{e.etudiant_mail}</td>
                <td className="px-4 py-3">{e.etudiant_tel}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(e)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(e.etudiant_id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg ml-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EtudiantList;
