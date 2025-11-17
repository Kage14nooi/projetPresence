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
        // Récupérer le professeur depuis la séance ou fallback
        // const professeur = presencesRaw.seance?.matiere?.professeur || {
        //   professeur_id: 0,
        //   professeur_nom: "Non défini",
        // };
        console.log(
          "Données récupéré :",
          presencesRaw.presences[0].seance?.matiere?.professeur?.professeur_nom
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

  // const handleDownloadExcel = () => {
  //   const presencesFiltered = presencesToDisplay || [];
  //   const excelRows = presencesFiltered.map((p) => ({
  //     Matricule: p.etudiant_matricule,
  //     Étudiant: `${p.etudiant_nom} ${p.etudiant_prenom}`,
  //     "Heure entrée": p.heure_entree || "-",
  //     "Heure sortie": p.heure_sortie || "-",
  //     Statut: p.status === "P" ? "Présent" : "Absent",
  //   }));
  //   const worksheet = XLSX.utils.json_to_sheet(excelRows);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
  //   XLSX.writeFile(workbook, `FichePrésence_${seance.seance_id}.xlsx`);
  // };
  const handleDownloadExcel = () => {
    const presencesFiltered = presencesToDisplay || [];

    // ==== TITRE PRINCIPAL ====
    const titleRow = [{ A: `FICHE DE PRÉSENCE – SÉANCE ${seance.seance_id}` }];

    // ==== INFORMATIONS DE LA SÉANCE ====
    const infoRows = [
      { A: "Date", B: seance.date_seance },
      { A: "Matière", B: seance.matiere?.matiere_nom || "Non défini" },
      {
        A: "Professeur",
        B:
          fiche?.presences[0].seance?.matiere?.professeur?.professeur_nom ||
          "Non défini",
      },
      {
        A: "Parcours",
        B: seance.matiere?.parcour?.parcours_nom || "Non défini",
      },
      { A: "Niveau", B: seance.matiere?.niveau?.niveau_nom || "Non défini" },
      { A: "Horaire", B: `${seance.heure_debut} - ${seance.heure_fin}` },
      {},
    ];

    // ==== TABLEAU DES ÉTUDIANTS ====
    const excelRows = presencesFiltered.map((p) => ({
      Matricule: p.etudiant_matricule,
      Nom: p.etudiant_nom,
      Prénom: p.etudiant_prenom,
      "Heure entrée": p.heure_entree || "-",
      "Heure sortie": p.heure_sortie || "-",
      Statut: p.status === "P" ? "Présent" : "Absent",
    }));

    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(titleRow, { skipHeader: true });

    // Fusionner les cellules A1:F1 pour un beau titre centré
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

    // Ajouter les infos
    XLSX.utils.sheet_add_json(worksheet, infoRows, {
      skipHeader: true,
      origin: "A3",
    });

    // Ajouter le tableau à partir de la ligne 10
    XLSX.utils.sheet_add_json(worksheet, excelRows, {
      origin: "A10",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Présence");

    XLSX.writeFile(workbook, `FichePresence_Seance${seance.seance_id}.xlsx`);
  };

  const handlePrint = () => {
    const presencesToDisplay = fiche?.presences || [];

    const printWindow = window.open("", "_blank", "width=900,height=650");

    if (printWindow) {
      // Générer le HTML des lignes du tableau
      const rowsHtml = presencesToDisplay
        .map(
          (p) => `
      <tr>
        <td>${p.etudiant_matricule || "-"}</td>
        <td>${p.etudiant_nom || ""} ${p.etudiant_prenom || ""}</td>
        <td>${p.heure_entree || "-"}</td>
        <td>${p.heure_sortie || "-"}</td>
        <td>${p.status === "P" ? "Présent" : "Absent"}</td>
      </tr>
    `
        )
        .join("");

      printWindow.document.write(`
      <html>
        <head>
          <title>Fiche de Présence</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 25px;
              color: #000;
            }
            h1 {
              text-align: center;
              font-size: 22px;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            .info-block {
              margin-bottom: 25px;
              font-size: 16px;
              line-height: 24px;
            }
            .info-block strong {
              display: inline-block;
              width: 140px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              font-size: 14px;
            }
            th {
              background: #f0f0f0;
              font-weight: bold;
            }
            .signature {
              margin-top: 40px;
              font-size: 15px;
            }
          </style>
        </head>
        <body>
          <h1>FICHE DE PRÉSENCE</h1>
          <div class="info-block">
            <strong>Matière :</strong> ${
              seance.matiere?.matiere_nom || "Non défini"
            }<br>
            <strong>Du :</strong> ${seance.date_seance}<br>
            <strong>Parcours :</strong> ${
              seance.matiere?.parcour?.parcours_nom || "Non défini"
            }<br>
            <strong>Niveau :</strong> ${
              seance.matiere?.niveau?.niveau_nom || "Non défini"
            }<br>
            <strong>Professeur :</strong> ${
              fiche?.presences[0].seance?.matiere?.professeur?.professeur_nom ||
              "Non défini"
            }
          </div>

          <table>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Étudiant</th>
                <th>Heure entrée</th>
                <th>Heure sortie</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="signature">
            <strong>Signature du professeur :</strong> ______________________________
          </div>
        </body>
      </html>
    `);

      printWindow.document.close();
      printWindow.print();
    }
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
          {/* <button
            onClick={handlePreviewExcel}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center space-x-1"
          >
            <HiOutlineDocumentText />
            <span>Prévisualiser Excel</span>
          </button> */}
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center space-x-1"
          >
            <HiOutlineDocumentText />
            <span>Télécharger Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center space-x-1"
          >
            <HiOutlineDocumentText />
            <span>Imprimer</span>
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
      Modal Excel
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
