const express = require("express");
const router = express.Router();
const NiveauController = require("../controllers/NiveauController");

router.post("/", NiveauController.createNiveau);
router.get("/", NiveauController.getNiveau);
router.get("/:id", NiveauController.getNiveauById);
router.get("/nom/:nom", NiveauController.searchNiveauByNom);
router.put("/:id", NiveauController.updateNiveau);
router.delete("/:id", NiveauController.deleteNiveau);

module.exports = router;
