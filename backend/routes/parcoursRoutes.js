const express = require("express");
const router = express.Router();
const parcoursController = require("../controllers/parcoursController");

router.post("/", parcoursController.createParcours);
router.get("/", parcoursController.getParcours);
router.get("/:id", parcoursController.getParcoursById);
router.get("/nom/:nom", parcoursController.searchParcoursByNom);
router.put("/:id", parcoursController.updateParcours);
router.delete("/:id", parcoursController.deleteParcours);

module.exports = router;
