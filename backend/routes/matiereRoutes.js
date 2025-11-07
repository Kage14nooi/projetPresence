const express = require("express");
const router = express.Router();
const matiereController = require("../controllers/matiereController");

router.post("/", matiereController.createMatiere);
router.get("/", matiereController.getMatieres);
router.get("/:id", matiereController.getMatiereById);
router.get("/nom/:nom", matiereController.searchByNom);
router.get("/parcours/:parcoursId", matiereController.searchByParcours);
router.put("/:id", matiereController.updateMatiere);
router.delete("/:id", matiereController.deleteMatiere);

module.exports = router;
