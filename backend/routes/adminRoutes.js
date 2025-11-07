const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/", adminController.createAdmin);
router.get("/", adminController.getAdmins);
router.get("/search", adminController.searchAdmins);
router.get("/:id", adminController.getAdminById);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

// Connexion (login)
router.post("/login", adminController.loginAdmin);

module.exports = router;
