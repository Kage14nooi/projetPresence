const express = require("express");
const router = express.Router();
const presenceController = require("../controllers/presenceController");

router.post("/upload", presenceController.uploadPresence); // depuis Fingerprint Clock
router.get("/", presenceController.getPresences);
router.get("/:id", presenceController.getPresenceById);
router.get("/etudiant/:etudiant_id", presenceController.getPresencesByEtudiant);
router.put("/:id", presenceController.updatePresence);
router.delete("/:id", presenceController.deletePresence);

module.exports = router;
