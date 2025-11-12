const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", adminController.createAdmin);
router.get("/", adminController.getAdmins);
router.get("/search", adminController.searchAdmins);
router.get("/:id", verifyToken, adminController.getAdminById);
router.put("/:id", verifyToken, adminController.updateAdmin);
router.delete("/:id", verifyToken, adminController.deleteAdmin);

// Connexion (login)
router.post("/login", adminController.loginAdmin);
router.post("/logout", verifyToken, adminController.logoutAdmin);

module.exports = router;
