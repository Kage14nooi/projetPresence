const express = require("express");
const router = express.Router();
const presenceController = require("../controllers/presenceController");

router.post("/upload", presenceController.uploadPresence);
router.get("/", presenceController.getPresences);

module.exports = router;
