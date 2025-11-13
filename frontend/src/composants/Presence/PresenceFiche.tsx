// src/components/PresenceFiche/PresenceFiche.tsx
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import type { Seance } from "../../types/types";
import { presenceService } from "../../services/PresenceService";
import type { FichePresence } from "../../services/PresenceService";
import type { Presence } from "../../types/types";
interface PresenceFicheProps {
  seance: Seance;
}

const PresenceFiche: React.FC<PresenceFicheProps> = ({ seance }) => {
  const [fiche, setFiche] = useState<FichePresence | null>(null);
  const [statusFilter, setStatusFilter] = useState<"P" | "A" | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Récupération des données
  useEffect(() => {
    const fetchFiche = async () => {
      setLoading(true);
      try {
        const presencesRaw = await presenceService.getFichePresence(
          seance.seance_id
        );
        console.log("Données brutes des présences :", presencesRaw.presences);
        // 🔹 Utilisation de etudiant_matricule à la place de etudiant_id
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

  // Filtrer les présences selon le filtre choisi
  const presencesToDisplay =
    fiche?.presences &&
    presenceService.filterPresences(fiche.presences, statusFilter);

  // Prévisualisation Excel filtrée
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

  // Télécharger Excel filtré
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
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">
        Fiche de présence - {seance.date_seance} ({seance.heure_debut} -{" "}
        {seance.heure_fin})
      </h3>

      <div className="flex space-x-2 mb-4">
        {["ALL", "P", "A"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-3 py-1 rounded ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {s === "ALL" ? "Tous" : s === "P" ? "Présents" : "Absents"}
          </button>
        ))}
        <button
          onClick={handlePreviewExcel}
          className="ml-auto px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Prévisualiser Excel
        </button>
        <button
          onClick={handleDownloadExcel}
          className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Télécharger Excel
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Matricule</th>
            <th className="border px-2 py-1">Étudiant</th>
            <th className="border px-2 py-1">Heure entrée</th>
            <th className="border px-2 py-1">Heure sortie</th>
            <th className="border px-2 py-1">Statut</th>
          </tr>
        </thead>
        <tbody>
          {presencesToDisplay?.map((p) => (
            <tr key={p.presence_id}>
              <td className="border px-2 py-1">{p.etudiant_matricule}</td>
              <td className="border px-2 py-1">
                {p.etudiant_nom} {p.etudiant_prenom}
              </td>
              <td className="border px-2 py-1">{p.heure_entree || "-"}</td>
              <td className="border px-2 py-1">{p.heure_sortie || "-"}</td>
              <td className="border px-2 py-1 text-center">
                {p.status === "P" ? "Présent" : "Absent"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de prévisualisation Excel */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Prévisualisation Excel"
        className="bg-white p-4 rounded shadow-lg max-w-4xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-bold mb-2">Prévisualisation Excel</h2>
        <button
          className="mb-2 px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => setModalOpen(false)}
        >
          Fermer
        </button>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                {excelData[0] &&
                  Object.keys(excelData[0]).map((key) => (
                    <th key={key} className="border px-2 py-1">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-2 py-1">
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
