const express = require("express");
const router = express.Router();
const etudiantController = require("../controllers/etudiantController");

router.post("/", etudiantController.createEtudiant);
router.get("/", etudiantController.getEtudiants);

module.exports = router;
