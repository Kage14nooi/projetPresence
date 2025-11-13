import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface MatiereListProps {
  matieres: any[];
  onEdit: (matiere: any) => void;
  onDelete: (id: number) => void;
}

const MatiereList: React.FC<MatiereListProps> = ({
  matieres,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Professeur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parcours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Niveau
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mentions
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {matieres.map((matiere) => {
            console.log(matiere);
            return (
              <tr key={matiere.matiere_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.matiere_nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.professeur?.professeur_nom}{" "}
                  {matiere.professeur?.professeur_prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.parcour?.parcours_nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.niveau?.niveau_nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.mention?.mention_nom}
                </td>

                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(matiere)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => onDelete(matiere.matiere_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            );
          })}
          {matieres.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Aucune matière trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatiereList;
