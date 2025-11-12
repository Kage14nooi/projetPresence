import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface NiveauListProps {
  niveau: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

const NiveauList: React.FC<NiveauListProps> = ({
  niveau,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du Niveau
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {niveau.map((p) => (
            <tr key={p.niveau_id}>
              <td className="px-6 py-4 whitespace-nowrap">{p.niveau_nom}</td>
              <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-3">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 />
                </button>
                <button
                  onClick={() => onDelete(p.niveau_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
          {niveau.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                Aucun Niveau trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NiveauList;
