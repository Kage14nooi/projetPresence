import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface ParcoursListProps {
  parcours: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

const ParcoursList: React.FC<ParcoursListProps> = ({
  parcours,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du parcours
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {parcours.map((p) => (
            <tr key={p.parcours_id}>
              <td className="px-6 py-4 whitespace-nowrap">{p.parcours_nom}</td>
              <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-3">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 />
                </button>
                <button
                  onClick={() => onDelete(p.parcours_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
          {parcours.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                Aucun parcours trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParcoursList;
