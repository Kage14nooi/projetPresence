const express = require("express");
const router = express.Router();

// Import du controller correctement
const sceanceController = require("../controllers/sceanceController");

// Créer une séance (avec vérification d'existence)
router.post("/", sceanceController.createSeance);

// Récupérer toutes les séances
router.get("/", sceanceController.getAllSeances);

// Récupérer une séance par ID
router.get("/:id", sceanceController.getSeanceById);

// Mettre à jour une séance
router.put("/:id", sceanceController.updateSeance);

// Supprimer une séance
router.delete("/:id", sceanceController.deleteSeance);

// Activer ou désactiver une séance
router.patch("/:id/toggle", sceanceController.toggleSeanceActive);

router.get("/presence/:id", sceanceController.getPresenceBySeance);

router.get("/absences/:id", sceanceController.getSeanceAbsents);
// Dans votre fichier routes
router.get("/check-expired", sceanceController.checkAndCloseExpiredSeances);

module.exports = router;
