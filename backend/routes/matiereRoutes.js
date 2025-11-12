// const express = require("express");
// const router = express.Router();
// const matiereController = require("../controllers/matiereController");

// router.post("/", matiereController.createMatiere);
// router.get("/", matiereController.getMatieres);
// router.get("/:id", matiereController.getMatiereById);
// router.get("/nom/:nom", matiereController.searchByNom);
// router.get("/parcours/:parcoursId", matiereController.searchByParcours);
// router.put("/:id", matiereController.updateMatiere);
// router.delete("/:id", matiereController.deleteMatiere);

// module.exports = router;

const express = require("express");
const router = express.Router();
const matiereController = require("../controllers/matiereController");

// ➕ Créer une matière
router.post("/", matiereController.createMatiere);

// 📋 Obtenir toutes les matières
router.get("/", matiereController.getMatieres);

// 🔍 Obtenir une matière par ID
router.get("/:id", matiereController.getMatiereById);

// 🔍 Rechercher une matière par nom
router.get("/nom/:nom", matiereController.searchByNom);

// 🔍 Rechercher les matières d’un parcours donné
router.get("/parcours/:parcoursId", matiereController.searchByParcours);

// ✏️ Modifier une matière
router.put("/:id", matiereController.updateMatiere);

// 🗑️ Supprimer une matière
router.delete("/:id", matiereController.deleteMatiere);

// 📄 Obtenir la fiche de présence d’une matière
router.get("/:id/presences", matiereController.getFichePresenceByMatiere);

module.exports = router;
