import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import type { Seance, Presence } from "../../types/types";
import {
  presenceService,
  type FichePresence,
} from "../../services/PresenceService";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDocumentText,
} from "react-icons/hi";

interface PresenceFicheProps {
  seance: Seance;
}

const PresenceFiche: React.FC<PresenceFicheProps> = ({ seance }) => {
  const [fiche, setFiche] = useState<FichePresence | null>(null);
  const [statusFilter, setStatusFilter] = useState<"P" | "A" | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchFiche = async () => {
      setLoading(true);
      try {
        const presencesRaw = await presenceService.getFichePresence(
          seance.seance_id
        );
        const ficheFormatted: FichePresence = {
          seance: presencesRaw.seance,
          presences: presencesRaw.presences.map(
            (p): Presence => ({
              ...p,
              etudiant_matricule: p.etudiant?.etudiant_matricule ?? "Inconnu",
              etudiant_nom: p.etudiant?.etudiant_nom ?? "Inconnu",
              etudiant_prenom: p.etudiant?.etudiant_prenom ?? "",
            })
          ),
        };
        setFiche(ficheFormatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiche();
  }, [seance]);

  const presencesToDisplay =
    fiche?.presences &&
    presenceService.filterPresences(fiche.presences, statusFilter);

  const handlePreviewExcel = () => {
    const presencesFiltered = presencesToDisplay || [];
    const excelRows = presencesFiltered.map((p) => ({
      Matricule: p.etudiant_matricule,
      Étudiant: `${p.etudiant_nom} ${p.etudiant_prenom}`,
      "Heure entrée": p.heure_entree || "-",
      "Heure sortie": p.heure_sortie || "-",
      Statut: p.status === "P" ? "Présent" : "Absent",
    }));
    setExcelData(excelRows);
    setModalOpen(true);
  };

  const handleDownloadExcel = () => {
    const presencesFiltered = presencesToDisplay || [];
    const excelRows = presencesFiltered.map((p) => ({
      Matricule: p.etudiant_matricule,
      Étudiant: `${p.etudiant_nom} ${p.etudiant_prenom}`,
      "Heure entrée": p.heure_entree || "-",
      "Heure sortie": p.heure_sortie || "-",
      Statut: p.status === "P" ? "Présent" : "Absent",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
    XLSX.writeFile(workbook, `FichePrésence_${seance.seance_id}.xlsx`);
  };

  if (loading) return <p>Chargement de la fiche...</p>;
  if (!fiche) return <p>Aucune donnée de présence.</p>;

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {/* Header avec icônes */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <HiOutlineDocumentText className="text-blue-600" />
            <span>Fiche de présence</span>
          </h3>

          <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-gray-600 text-sm">
            <div className="flex items-center space-x-1">
              <HiOutlineCalendar />
              <span>{seance.date_seance}</span>
            </div>
            <div className="flex items-center space-x-1">
              <HiOutlineClock />
              <span>
                {seance.heure_debut} - {seance.heure_fin}
              </span>
            </div>
          </div>
        </div>

        {/* Boutons Excel */}
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={handlePreviewExcel}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center space-x-1"
          >
            <HiOutlineDocumentText />
            <span>Prévisualiser Excel</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center space-x-1"
          >
            <HiOutlineDocumentText />
            <span>Télécharger Excel</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 mb-4">
        {["ALL", "P", "A"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-3 py-1 rounded-full font-medium ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s === "ALL" ? "Tous" : s === "P" ? "Présents" : "Absents"}
          </button>
        ))}
      </div>

      {/* Tableau moderne */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                Matricule
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                Étudiant
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                Heure entrée
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                Heure sortie
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {presencesToDisplay?.map((p) => (
              <tr key={p.presence_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 text-sm">{p.etudiant_matricule}</td>
                <td className="px-4 py-2 text-sm">
                  {p.etudiant_nom} {p.etudiant_prenom}
                </td>
                <td className="px-4 py-2 text-sm">{p.heure_entree || "-"}</td>
                <td className="px-4 py-2 text-sm">{p.heure_sortie || "-"}</td>
                <td
                  className={`px-4 py-2 text-sm text-center font-semibold ${
                    p.status === "P" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.status === "P" ? "Présent" : "Absent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Excel */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Prévisualisation Excel"
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-20 overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <HiOutlineDocumentText />
          <span>Prévisualisation Excel</span>
        </h2>
        <button
          className="mb-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
          onClick={() => setModalOpen(false)}
        >
          <span>Fermer</span>
        </button>
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {excelData[0] &&
                  Object.keys(excelData[0]).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-3 py-2 text-sm">
                      {val !== null && val !== undefined ? val.toString() : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default PresenceFiche;
