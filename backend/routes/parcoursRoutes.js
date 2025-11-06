const express = require("express");
const router = express.Router();
const parcoursController = require("../controllers/parcoursController");

router.post("/", parcoursController.createParcours);
router.get("/", parcoursController.getParcours);

module.exports = router;
