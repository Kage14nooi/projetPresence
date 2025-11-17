// ------------------- TYPES -------------------
export interface Etudiant {
  etudiant_id: number;
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_matricule: string;
  etudiant_mail: string;
  etudiant_tel: string;
  parcours_id: number;
  mention_id: number;
  niveau_id: number;
  role_id: number;
  device_user_id: string;
}

export interface Seance {
  seance_id: number;
  matiere_id: number;
  date_seance: string; // YYYY-MM-DD
  heure_debut: string; // HH:mm:ss
  heure_fin: string; // HH:mm:ss
  is_active: boolean;
}

export interface Presence {
  presence_id: number;
  etudiant_id: number;
  seance_id: number;
  heure_entree: string | null;
  heure_sortie: string | null;
  status: "P" | "A";

  // Champs "plats" de l'étudiant
  etudiant_nom?: string;
  etudiant_prenom?: string;
  etudiant_matricule?: string;
  etudiant_mail?: string;
  etudiant_tel?: string;
  parcours_id?: number;
  mention_id?: number;
  niveau_id?: number;
  role_id?: number;
  device_user_id?: string;

  etudiant?: Etudiant;
  seance?: Seance;
}

export interface Mention {
  mention_nom: string;
}

export interface Parcours {
  parcours_nom: string;
}

export interface Niveau {
  niveau_nom: string;
}
export interface Professeur {
  professeur_id: number;
  professeur_nom: string;
  professeur_prenom: string;
  professeur_mail: string;
  professeur_tel: string;
}

export interface Matiere {
  matiere_nom: string;
  professeur?: Professeur; // 👈 Ajout du professeur
  mention?: Mention;
  parcour?: Parcours; // ⚠️ Nom exact selon backend
  niveau?: Niveau;
}

export interface Seance {
  seance_id: number;
  date_seance: string;
  heure_debut: string;
  heure_fin: string;
  matiere?: Matiere; // 👈 OBLIGATOIRE POUR ENLEVER L’ERREUR
}

export interface PieceJustificative {
  pieceJust_id: number;
  pieceJust_description: string;
  motif: string;
  pieceJust_file: string;
}

export interface Absence {
  absence_id: number;
  etudiant_id: number;
  seance_id: number;
  statut: "Absent" | "Présent" | "En retard";
  justification_status: "En attente" | "Validée" | "Refusée";
  etudiant?: Etudiant;
  seance?: Seance;
  pieces?: PieceJustificative[];
}
