// import axios from "axios";

// const API_BASE_URL = "http://localhost:3001/api";

// // ========================================
// // SERVICES DASHBOARD
// // ========================================

// /**
//  * Récupérer le top 5 des étudiants les plus absents
//  */
// export async function getTop5Absents() {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/dashboard/top5-absents`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement du top 5 absents");
//   }
// }

// /**
//  * Récupérer le top 5 des étudiants en retard
//  */
// export async function getTopRetards() {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/dashboard/top-retards`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des retards");
//   }
// }

// /**
//  * Récupérer le taux de présence global
//  */
// export async function getPresenceGlobale() {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/dashboard/presence-global`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement de la présence globale");
//   }
// }

// /**
//  * Récupérer les absences par jour de la semaine
//  */
// export async function getAbsencesParJour() {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/dashboard/absences-jour`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des absences par jour");
//   }
// }

// /**
//  * Récupérer toutes les données du dashboard en une seule fois
//  */
// export async function getDashboardData() {
//   try {
//     const [top5Absents, topRetards, presenceGlobale, absencesParJour] =
//       await Promise.all([
//         getTop5Absents(),
//         getTopRetards(),
//         getPresenceGlobale(),
//         getAbsencesParJour(),
//       ]);

//     return {
//       top5Absents,
//       topRetards,
//       presenceGlobale: presenceGlobale.taux_presence,
//       absencesParJour,
//     };
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des données du dashboard");
//   }
// }

// // ========================================
// // SERVICES RAPPORT ÉTUDIANT
// // ========================================

// /**
//  * Récupérer le rapport complet d'un étudiant
//  * @param id - ID de l'étudiant
//  */
// export async function getRapportEtudiant(id: number | string) {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/rapport/etudiant/${id}`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement du rapport étudiant");
//   }
// }

// // ========================================
// // SERVICES ABSENCES PAR ÉTUDIANT
// // ========================================

// /**
//  * Récupérer toutes les absences d'un étudiant
//  * @param id - ID de l'étudiant
//  */
// export async function getAbsencesParEtudiant(id: number | string) {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/etudiant/${id}/absences`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des absences de l'étudiant");
//   }
// }

// // ========================================
// // SERVICES ABSENCES PAR MATIÈRE
// // ========================================

// /**
//  * Récupérer les absences pour une matière spécifique
//  * @param id - ID de la matière
//  */
// export async function getAbsencesParMatiere(id: number | string) {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/rapport/matiere/${id}/absences`
//     );
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des absences par matière");
//   }
// }

// // ========================================
// // SERVICES ABSENCES PAR PÉRIODE
// // ========================================

// /**
//  * Récupérer les absences sur une période donnée
//  * @param debut - Date de début (format: YYYY-MM-DD)
//  * @param fin - Date de fin (format: YYYY-MM-DD)
//  */
// export async function getAbsencesParPeriode(debut: string, fin: string) {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/rapport/absences-periode`, {
//       params: { debut, fin },
//     });
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des absences par période");
//   }
// }

// // ========================================
// // SERVICES ABSENCES ANNUELLES
// // ========================================

// /**
//  * Récupérer les absences pour une année donnée
//  * @param annee - Année (format: YYYY)
//  */
// export async function getAbsencesAnnuelle(annee: number | string) {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/rapport/absences-annuelle`, {
//       params: { annee },
//     });
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur lors du chargement des absences annuelles");
//   }
// }

// // ========================================
// // TYPES (optionnel - pour TypeScript)
// // ========================================

// export interface Etudiant {
//   id: number;
//   nom: string;
//   prenom: string;
//   email: string;
//   matricule: string;
// }

// export interface Absence {
//   id: number;
//   etudiant_id: number;
//   seance_id: number;
//   statut: "Absent" | "En retard";
//   etudiant?: Etudiant;
//   seance?: Seance;
// }

// export interface Seance {
//   id: number;
//   date_seance: string;
//   heure_debut: string;
//   heure_fin: string;
//   matiere_id: number;
//   matiere?: Matiere;
// }

// export interface Matiere {
//   id: number;
//   nom: string;
// }

// export interface DashboardData {
//   top5Absents: Array<{
//     etudiant_id: number;
//     total: number;
//     etudiant: Etudiant;
//   }>;
//   topRetards: Array<{
//     etudiant_id: number;
//     total: number;
//     etudiant: Etudiant;
//   }>;
//   presenceGlobale: string;
//   absencesParJour: Record<string, number>;
// }

// export interface RapportEtudiant {
//   etudiant: Etudiant;
//   total_absences: number;
//   total_presences: number;
//   retards: number;
//   details_absences: Absence[];
//   details_presences: any[];
// }

import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// ========================================
// SERVICES DASHBOARD
// ========================================

/**
 * Récupérer le top 5 des étudiants les plus absents
 */
export async function getTop5Absents() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/dashboard/top5-absents`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement du top 5 absents");
  }
}

/**
 * Récupérer le top 5 des étudiants en retard
 */
export async function getTopRetards() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/dashboard/top-retards`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des retards");
  }
}

/**
 * Récupérer le taux de présence global
 */
export async function getPresenceGlobale() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/dashboard/presence-global`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement de la présence globale");
  }
}

/**
 * Récupérer les absences par jour de la semaine
 */
export async function getAbsencesParJour() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/dashboard/absences-jour`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des absences par jour");
  }
}

/**
 * Récupérer toutes les données du dashboard en une seule fois
 */
export async function getDashboardData() {
  try {
    const [top5Absents, topRetards, presenceGlobale, absencesParJour] =
      await Promise.all([
        getTop5Absents(),
        getTopRetards(),
        getPresenceGlobale(),
        getAbsencesParJour(),
      ]);

    return {
      top5Absents,
      topRetards,
      presenceGlobale: presenceGlobale.taux_presence,
      absencesParJour,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des données du dashboard");
  }
}

// ========================================
// SERVICES STATISTIQUES AVANCÉES
// ========================================

/**
 * Récupérer les statistiques complètes d'un étudiant
 */
export async function getStatistiquesEtudiant(id: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/etudiant/${id}`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des statistiques étudiant");
  }
}

/**
 * Récupérer le volume horaire perdu par matière
 */
export async function getVolumeHoraireParMatiere(matiereId: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/matiere/${matiereId}/volume-horaire`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement du volume horaire");
  }
}

/**
 * Récupérer les heures perdues par niveau et mention
 */
export async function getHeuresPerduesParNiveauMention() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/heures-perdues-niveau-mention`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des heures perdues");
  }
}

/**
 * Récupérer le pourcentage d'absences par matière (pour camembert)
 */
export async function getPourcentageAbsencesParMatiere() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/pourcentage-absences-matiere`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des pourcentages");
  }
}

/**
 * Récupérer les statistiques pour une période
 */
export async function getStatistiquesPeriode(debut: string, fin: string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/periode`,
      {
        params: { debut, fin },
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des statistiques de période");
  }
}

/**
 * Récupérer les statistiques annuelles
 */
export async function getStatistiquesAnnuelles(annee: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/annuelles`,
      {
        params: { annee },
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des statistiques annuelles");
  }
}

/**
 * Récupérer la liste des étudiants avec alerte
 */
export async function getEtudiantsAvecAlerte(seuil: number = 25) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/statistiques/etudiants-alerte`,
      {
        params: { seuil },
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des alertes");
  }
}

/**
 * Récupérer le rapport complet d'un étudiant (pour PDF)
 */
export async function getRapportCompletEtudiant(id: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/rapport/etudiant/${id}/complet`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement du rapport complet");
  }
}

/**
 * Récupérer toutes les données avancées du dashboard
 */
export async function getDashboardDataAvance() {
  try {
    const [
      dashboardBase,
      pourcentagesMatieres,
      heuresPerdues,
      etudiantsAlerte,
    ] = await Promise.all([
      getDashboardData(),
      getPourcentageAbsencesParMatiere(),
      getHeuresPerduesParNiveauMention(),
      getEtudiantsAvecAlerte(),
    ]);

    return {
      ...dashboardBase,
      pourcentagesMatieres,
      heuresPerdues,
      etudiantsAlerte,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement du dashboard avancé");
  }
}

// ========================================
// SERVICES RAPPORT ÉTUDIANT (anciens - conservés)
// ========================================

/**
 * Récupérer le rapport basique d'un étudiant
 */
export async function getRapportEtudiant(id: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/rapport/etudiant/${id}/complet`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement du rapport étudiant");
  }
}

export async function getAbsencesParEtudiant(id: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/etudiant/${id}/absences`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des absences de l'étudiant");
  }
}

export async function getAbsencesParMatiere(id: number | string) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/rapport/matiere/${id}/absences`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des absences par matière");
  }
}

export async function getAbsencesParPeriode(debut: string, fin: string) {
  try {
    const res = await axios.get(`${API_BASE_URL}/rapport/absences-periode`, {
      params: { debut, fin },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des absences par période");
  }
}

export async function getAbsencesAnnuelle(annee: number | string) {
  try {
    const res = await axios.get(`${API_BASE_URL}/rapport/absences-annuelle`, {
      params: { annee },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des absences annuelles");
  }
}

// ========================================
// TYPES (TypeScript)
// ========================================

export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  parcours?: string;
  mention?: string;
  niveau?: string;
}

export interface StatistiqueMatiere {
  matiere_id: number;
  matiere_nom: string;
  absences: number;
  retards: number;
  presences: number;
  heures_perdues: number;
  pourcentage_absence: string;
  pourcentage_presence: string;
}

export interface StatistiquesEtudiant {
  etudiant: Etudiant;
  resume: {
    total_absences: number;
    total_retards: number;
    total_presences: number;
    heures_perdues: string;
    taux_absence: string;
    score_regularite: string;
  };
  alerte: {
    active: boolean;
    message: string | null;
    seuil: number;
  };
  statistiques_par_matiere: StatistiqueMatiere[];
}

export interface HeuresPerduesNiveauMention {
  niveau: string;
  mention: string;
  total_absences: number;
  heures_perdues: number;
}

export interface PourcentageAbsenceMatiere {
  matiere_id: number;
  matiere_nom: string;
  total_absences: number;
  pourcentage: string;
}

export interface EtudiantAvecAlerte {
  etudiant: Etudiant;
  statistiques: {
    total_absences: number;
    total_presences: number;
    taux_absence: string;
  };
  alerte: {
    niveau: "CRITIQUE" | "ÉLEVÉ" | "MOYEN";
    message: string;
  };
}

export interface RapportComplet {
  etudiant: Etudiant;
  resume: {
    total_absences_completes: number;
    total_retards: number;
    total_presences: number;
    heures_perdues: string;
    score_regularite: string;
  };
  statistiques_par_matiere: StatistiqueMatiere[];
  details_absences: Array<{
    date: string;
    matiere: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
  }>;
  details_retards: Array<{
    date: string;
    matiere: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
  }>;
  date_generation: string;
}

export interface DashboardData {
  top5Absents: Array<{
    etudiant_id: number;
    total: number;
    etudiant: Etudiant;
  }>;
  topRetards: Array<{
    etudiant_id: number;
    total: number;
    etudiant: Etudiant;
  }>;
  presenceGlobale: string;
  absencesParJour: Record<string, number>;
}

export interface DashboardDataAvance extends DashboardData {
  pourcentagesMatieres: PourcentageAbsenceMatiere[];
  heuresPerdues: HeuresPerduesNiveauMention[];
  etudiantsAlerte: {
    seuil: number;
    total_etudiants_alerte: number;
    etudiants: EtudiantAvecAlerte[];
  };
}
