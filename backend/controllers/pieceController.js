const { PieceJustificative } = require("../models");
const path = require("path");
const fs = require("fs");

// CREATE
exports.createPiece = async (req, res) => {
  try {
    const { pieceJust_description } = req.body;
    const file = req.file ? req.file.filename : null;

    const newPiece = await PieceJustificative.create({
      pieceJust_description,
      pieceJust_file: file,
    });

    res.status(201).json(newPiece);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// READ ALL
exports.getAllPieces = async (req, res) => {
  try {
    const pieces = await PieceJustificative.findAll();
    res.json(pieces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
exports.getPieceById = async (req, res) => {
  try {
    const piece = await PieceJustificative.findByPk(req.params.id);
    if (!piece) return res.status(404).json({ error: "Pièce non trouvée." });
    res.json(piece);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updatePiece = async (req, res) => {
  try {
    const piece = await PieceJustificative.findByPk(req.params.id);
    if (!piece) return res.status(404).json({ error: "Pièce non trouvée." });

    const { pieceJust_description } = req.body;
    if (pieceJust_description)
      piece.pieceJust_description = pieceJust_description;

    if (req.file) {
      // supprimer l'ancien fichier
      if (piece.pieceJust_file) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads",
          piece.pieceJust_file
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      piece.pieceJust_file = req.file.filename;
    }

    await piece.save();
    res.json(piece);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deletePiece = async (req, res) => {
  try {
    const piece = await PieceJustificative.findByPk(req.params.id);
    if (!piece) return res.status(404).json({ error: "Pièce non trouvée." });

    if (piece.pieceJust_file) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        piece.pieceJust_file
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await piece.destroy();
    res.json({ message: "Pièce supprimée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
