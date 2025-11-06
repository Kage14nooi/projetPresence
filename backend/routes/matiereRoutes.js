const express = require("express");
const router = express.Router();
const matiereController = require("../controllers/matiereController");

router.post("/", matiereController.createMatiere);
router.get("/", matiereController.getMatieres);

module.exports = router;
