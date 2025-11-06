const express = require("express");
const router = express.Router();
const etudiantController = require("../controllers/etudiantController");

router.post("/", etudiantController.createEtudiant);
router.get("/", etudiantController.getEtudiants);
router.get("/filter", etudiantController.filterEtudiants); // filtrage via query params
router.get("/:id", etudiantController.getEtudiantById);
router.put("/:id", etudiantController.updateEtudiant);
router.delete("/:id", etudiantController.deleteEtudiant);

module.exports = router;
