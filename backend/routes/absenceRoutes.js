const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");

// Routes Absences
router.post("/", absenceController.createAbsence);
router.get("/", absenceController.getAbsences);
router.get("/search", absenceController.searchAbsences);
router.get("/:id", absenceController.getAbsenceById);
router.put("/:id", absenceController.updateAbsence);
router.delete("/:id", absenceController.deleteAbsence);

// ✅ Génération automatique des absences
router.post("/generate", absenceController.generateAbsences);

module.exports = router;
