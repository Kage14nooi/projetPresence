const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/", adminController.createAdmin);
router.get("/", adminController.getAdmins);

module.exports = router;
