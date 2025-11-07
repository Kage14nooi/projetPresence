const express = require("express");
const router = express.Router();
const pieceController = require("../controllers/pieceController");

router.post("/", pieceController.createPiece);
router.get("/", pieceController.getPieces);
router.get("/:id", pieceController.getPieceById);
router.get(
  "/description/:description",
  pieceController.searchPieceByDescription
);
router.put("/:id", pieceController.updatePiece);
router.delete("/:id", pieceController.deletePiece);

module.exports = router;
