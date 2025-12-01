const express = require("express");
const router = express.Router();
const appareilController = require("../controllers/appareilCOntroller");

// Routes Appareils
router.post("/", appareilController.createAppareil);
router.get("/", appareilController.getAllAppareils);
router.get("/:id", appareilController.getAppareilById);
router.put("/:id", appareilController.updateAppareil);
router.delete("/:id", appareilController.deleteAppareil);

module.exports = router;
