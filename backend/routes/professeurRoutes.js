const express = require("express");
const router = express.Router();
const professeurController = require("../controllers/professeurController");

router.post("/", professeurController.createProfesseur);
router.get("/", professeurController.getProfesseurs);

module.exports = router;
