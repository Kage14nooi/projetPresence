import React, { useEffect, useState } from "react";
import { UserPlus, FileText } from "lucide-react";
import {
  getPieces,
  createPiece,
  updatePiece,
  deletePiece,
} from "../services/pieceService";

import PieceList from "../composants/PieceJustificatif/PieceList";
import PieceModal from "../composants/PieceJustificatif/PieceModal";

import { getAbsences } from "../services/SeanceService";

const initialFormData = {
  pieceJust_id: null,
  absence_id: "",
  motif: "",
  pieceJust_file: null,
  pieceJust_description: "",
  existing_file_name: "",
};

const PiecePage: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);
  const [absences, setAbsences] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchPieces = async () => {
    try {
      const data = await getPieces();
      setPieces(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAbsences = async () => {
    try {
      const data = await getAbsences();
      setAbsences(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPieces();
    fetchAbsences();
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.absence_id) newErrors.absence_id = "L'absence est requise";
    if (!formData.motif) newErrors.motif = "Le motif est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (formData.pieceJust_id) {
        await updatePiece(formData.pieceJust_id, formData);
      } else {
        await createPiece(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setErrors({});
      fetchPieces();
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette pièce justificative ?")) {
      await deletePiece(id);
      fetchPieces();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pièces Justificatives
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez et consultez les pièces justificatives
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setIsModalOpen(true);
              setErrors({});
            }}
            className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Ajouter une pièce</span>
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Chargement des pièces...
              </p>
            </div>
          </div>
        ) : (
          <PieceList
            pieces={pieces}
            onEdit={(p) => {
              setFormData({ ...p, existing_file_name: p.pieceJust_file });
              setIsModalOpen(true);
              setErrors({});
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <PieceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        errors={errors}
        absences={absences}
      />
    </div>
  );
};

export default PiecePage;
