const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Routes notifications
router.post("/", notificationController.createNotification);
router.get("/", notificationController.getNotifications);

module.exports = router;
