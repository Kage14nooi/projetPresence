const express = require("express");
const router = express.Router();
const PieceController = require("../controllers/pieceController");
const upload = require("../middlewares/uploads");

// ---------------- Routes CRUD ----------------
router.post("/", upload.single("file"), PieceController.createPiece);
router.get("/", PieceController.getAllPieces);
router.get("/:id", PieceController.getPieceById);
router.put("/:id", upload.single("file"), PieceController.updatePiece);
router.delete("/:id", PieceController.deletePiece);

module.exports = router;
