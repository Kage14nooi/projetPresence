import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface SeanceListProps {
  seances: any[];
  matieres: any[];
  onEdit: (s: any) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

const SeanceList: React.FC<SeanceListProps> = ({
  seances,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Matière
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Heure début
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Heure fin
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {seances.map((s) => (
            <tr key={s.seance_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {s.matiere?.matiere_nom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{s.date_seance}</td>
              <td className="px-6 py-4 whitespace-nowrap">{s.heure_debut}</td>
              <td className="px-6 py-4 whitespace-nowrap">{s.heure_fin}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <input
                  type="checkbox"
                  checked={s.is_active}
                  onChange={() => onToggleActive(s.seance_id)}
                  className="h-5 w-5 text-blue-600"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-3">
                <button
                  onClick={() => onEdit(s)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 />
                </button>
                <button
                  onClick={() => onDelete(s.seance_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
          {seances.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Aucune séance trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SeanceList;
