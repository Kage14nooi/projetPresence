const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// POST
router.post("/", notificationController.createNotification);
router.post("/send-selected", notificationController.sendNotificationsSelected);

// GET
router.get("/", notificationController.getNotifications);
// router.get("/etudiant/:etudiantId", notificationController.searchByEtudiant); // ✅ avant /:id
router.get("/:id", notificationController.getNotificationById);

// PUT / DELETE
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
