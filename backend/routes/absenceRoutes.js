const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");

router.post("/", absenceController.createAbsence);
router.get("/", absenceController.getAbsences);

module.exports = router;
