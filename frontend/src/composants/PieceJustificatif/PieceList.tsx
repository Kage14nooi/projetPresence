import React from "react";
import { Edit2, Trash2, FileText } from "lucide-react";

interface Piece {
  pieceJust_id: number;
  absence_id: number;
  motif: "Maladie" | "Evénement familial" | "Autres";
  pieceJust_file?: string;
  pieceJust_description?: string;
}

interface PieceListProps {
  pieces: Piece[];
  onEdit: (piece: Piece) => void;
  onDelete: (id: number) => void;
}

const PieceList: React.FC<PieceListProps> = ({ pieces, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Motif
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Fichier
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {pieces.length > 0 ? (
            pieces.map((piece) => (
              <tr key={piece.pieceJust_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {piece.motif}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {piece.pieceJust_description || "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {piece.pieceJust_file ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <a
                        href={`http://localhost:3001/uploads/${piece.pieceJust_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir le fichier
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-400">Aucun fichier</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(piece)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition"
                    title="Modifier"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => onDelete(piece.pieceJust_id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition"
                    title="Supprimer"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-gray-500 text-sm"
              >
                Aucune pièce justificative trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PieceList;
