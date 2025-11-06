const express = require("express");
const router = express.Router();
const pieceController = require("../controllers/pieceController");

router.post("/", pieceController.createPiece);
router.get("/", pieceController.getPieces);

module.exports = router;
