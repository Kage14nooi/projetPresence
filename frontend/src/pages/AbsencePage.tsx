import React, { useEffect, useState } from "react";
import AbsenceList from "../composants/Absence/AbsenceList";
import {
  getAbsences,
  deleteAbsence,
  updateAbsence,
} from "../services/AbsenceService";

interface Absence {
  absence_id: number;
  etudiant: {
    etudiant_id: number;
    etudiant_nom: string;
    etudiant_prenom: string;
    etudiant_matricule: string;
    niveau?: { niveau_nom: string };
    parcour?: { parcours_nom: string };
    mention?: { mention_nom: string };
  };
  seance: {
    seance_id: number;
    date_seance: string;
    heure_debut: string;
    heure_fin: string;
    matiere: { matiere_nom: string };
  };
  statut: "Absent" | "Présent" | "En retard";
  justification_status: "En attente" | "Validée" | "Refusée";
  pieces: {
    pieceJust_id: number;
    pieceJust_description: string;
    motif: string;
    pieceJust_file: string;
  }[];
}

const AbsencePage: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    setLoading(true);
    const data = await getAbsences();
    setAbsences(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette absence ?")) {
      await deleteAbsence(id);
      fetchAbsences();
    }
  };

  const handleEdit = async (absence: Absence) => {
    // Exemple simple : toggle statut
    const newStatut = absence.statut === "Absent" ? "Présent" : "Absent";
    const updatedAbsence = { ...absence, statut: newStatut };
    await updateAbsence(updatedAbsence);
    fetchAbsences();
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>Chargement des absences...</p>
      ) : (
        <AbsenceList
          absences={absences}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AbsencePage;
