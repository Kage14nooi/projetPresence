// const router = require("express").Router();
// const stats = require("../controllers/rapportController");

// router.get("/etudiant/:id/absences", stats.absenceParEtudiant);
// router.get("/matiere/:id/absences", stats.absenceParMatiere);
// router.get("/absences-periode", stats.absencesParPeriode);
// router.get("/absences-annuelle", stats.absenceAnnuelle);

// // Dashboard
// router.get("/dashboard/top5-absents", stats.top5Absents);
// router.get("/dashboard/top-retards", stats.topRetards);
// router.get("/dashboard/presence-global", stats.presenceGlobale);
// router.get("/dashboard/absences-jour", stats.absencesParJour);

// // Rapport étudiant
// router.get("/rapport/etudiant/:id", stats.rapportEtudiant);

// module.exports = router;

const router = require("express").Router();
const stats = require("../controllers/rapportController");

// ========================================
// ROUTES STATISTIQUES AVANCÉES
// ========================================

// Volume horaire perdu par matière
router.get(
  "/statistiques/matiere/:id/volume-horaire",
  stats.volumeHoraireParMatiere
);

// Heures perdues par niveau et mention
router.get(
  "/statistiques/heures-perdues-niveau-mention",
  stats.heuresPerduesParNiveauMention
);

// Pourcentage d'absences par matière (pour camembert)
router.get(
  "/statistiques/pourcentage-absences-matiere",
  stats.pourcentageAbsencesParMatiere
);

// Statistiques pour une période
router.get("/statistiques/periode", stats.statistiquesPeriode);

// Statistiques annuelles
router.get("/statistiques/annuelles", stats.statistiquesAnnuelles);

// Étudiants avec alerte (dépassement seuil)
router.get("/statistiques/etudiants-alerte", stats.etudiantsAvecAlerte);

// ========================================
// ROUTES RAPPORTS
// ========================================

// Rapport complet d'un étudiant (pour PDF)
router.get("/rapport/etudiant/:id/complet", stats.rapportCompletEtudiant);

// ========================================
// ROUTES ANCIENNES (conservées pour compatibilité)
// ========================================

router.get("/etudiant/:id/absences", stats.absenceParEtudiant);
router.get("/matiere/:id/absences", stats.absenceParMatiere);
router.get("/absences-periode", stats.absencesParPeriode);
router.get("/absences-annuelle", stats.absenceAnnuelle);

// Dashboard
router.get("/dashboard/top5-absents", stats.top5Absents);
router.get("/dashboard/top-retards", stats.topRetards);
router.get("/dashboard/presence-global", stats.presenceGlobale);
router.get("/dashboard/absences-jour", stats.absencesParJour);

// Rapport étudiant basique
router.get("/rapport/etudiant/:id", stats.rapportEtudiant);

module.exports = router;
