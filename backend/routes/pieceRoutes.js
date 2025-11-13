const express = require("express");
const router = express.Router();
const PieceController = require("../controllers/pieceController");
const multer = require("multer");
const path = require("path");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage: storage });

// ---------------- Routes CRUD ----------------
router.post("/", upload.single("file"), PieceController.createPiece);
router.get("/", PieceController.getAllPieces);
router.get("/:id", PieceController.getPieceById);
router.put("/:id", upload.single("file"), PieceController.updatePiece);
router.delete("/:id", PieceController.deletePiece);

module.exports = router;
