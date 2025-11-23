const express = require("express");
const router = express.Router();
const presenceController = require("../controllers/presenceController");
const {
  importHikvisionCSV,
} = require("../controllers/ImportPresenceController");

const upload = require("../middlewares/uploads");

router.post("/upload", presenceController.uploadPresence); // depuis Fingerprint Clock
router.get("/", presenceController.getPresences);
router.get("/:id", presenceController.getPresenceById);
router.get("/etudiant/:etudiant_id", presenceController.getPresencesByEtudiant);
router.put("/:id", presenceController.updatePresence);
router.delete("/:id", presenceController.deletePresence);
router.get("/sceances/export/:id", presenceController.exportFicheExcel);

// Import Excel pour une séance spécifique
router.post("/import-hikvision/:id", upload.single("file"), importHikvisionCSV);
module.exports = router;
