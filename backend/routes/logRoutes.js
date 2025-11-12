const express = require("express");
const router = express.Router();
const logAppareilController = require("../controllers/logController");

// Créer un log
router.post("/", logAppareilController.createLog);

// Récupérer tous les logs
router.get("/", logAppareilController.getLogs);

// Rechercher les logs par device_user_id (anciennement matricule)
router.get("/user/:user_id", logAppareilController.searchByDeviceUser);

// Supprimer un log
router.delete("/:id", logAppareilController.deleteLog);

module.exports = router;
