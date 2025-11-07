const { PieceJustificative } = require("../models");

// ➕ Créer une pièce justificative
exports.createPiece = async (req, res) => {
  try {
    const piece = await PieceJustificative.create(req.body);
    res.status(201).json(piece);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Récupérer toutes les pièces justificatives
exports.getPieces = async (req, res) => {
  try {
    const pieces = await PieceJustificative.findAll({
      order: [["pieceJust_description", "ASC"]],
    });
    res.json(pieces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer une pièce par ID
exports.getPieceById = async (req, res) => {
  try {
    const { id } = req.params;
    const piece = await PieceJustificative.findByPk(id);
    if (!piece)
      return res.status(404).json({ error: "Pièce justificative non trouvée" });
    res.json(piece);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher une pièce par description
exports.searchPieceByDescription = async (req, res) => {
  try {
    const { description } = req.params;
    const pieces = await PieceJustificative.findAll({
      where: { pieceJust_description: description },
    });
    res.json(pieces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une pièce justificative
exports.updatePiece = async (req, res) => {
  try {
    const { id } = req.params;
    const piece = await PieceJustificative.findByPk(id);
    if (!piece)
      return res.status(404).json({ error: "Pièce justificative non trouvée" });

    await piece.update(req.body);
    res.json({ message: "Pièce justificative mise à jour avec succès", piece });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une pièce justificative
exports.deletePiece = async (req, res) => {
  try {
    const { id } = req.params;
    const piece = await PieceJustificative.findByPk(id);
    if (!piece)
      return res.status(404).json({ error: "Pièce justificative non trouvée" });

    await piece.destroy();
    res.json({ message: "Pièce justificative supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
