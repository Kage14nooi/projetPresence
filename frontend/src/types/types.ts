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
