const express = require("express");
const router = express.Router();
const logAppareilController = require("../controllers/logController");

router.post("/", logAppareilController.createLog);
router.get("/", logAppareilController.getLogs);
router.get("/matricule/:matricule", logAppareilController.searchByMatricule);
router.get("/date/:date", logAppareilController.searchByDate);
router.put("/:id", logAppareilController.updateLog);
router.delete("/:id", logAppareilController.deleteLog);

module.exports = router;
