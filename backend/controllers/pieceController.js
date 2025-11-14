const { PieceJustificative, Absence } = require("../models"); // Assure-toi que le modèle est exporté correctement
const fs = require("fs");
const path = require("path");

// ---------------- CREATE ----------------
exports.createPiece = async (req, res) => {
  try {
    const { absence_id, motif, pieceJust_description } = req.body;
    let pieceJust_file = null;

    if (req.file) {
      pieceJust_file = req.file.filename; // Nom du fichier uploadé
    }

    const newPiece = await PieceJustificative.create({
      absence_id,
      motif,
      pieceJust_description,
      pieceJust_file,
    });

    //  Mettre à jour le statut de justification de l'absence
    const absence = await Absence.findByPk(absence_id);
    if (absence) {
      absence.justification_status = "Validée"; // On peut adapter selon ton workflow
      await absence.save();
    }

    res.status(201).json(newPiece);
  } catch (error) {
    console.error("Erreur création pièce :", error);
    res
      .status(500)
      .json({ error: "Impossible de créer la pièce justificative" });
  }
};

// ---------------- READ ALL ----------------
exports.getAllPieces = async (req, res) => {
  try {
    const pieces = await PieceJustificative.findAll();
    res.json(pieces);
  } catch (error) {
    console.error("Erreur récupération pièces :", error);
    res
      .status(500)
      .json({ error: "Impossible de récupérer les pièces justificatives" });
  }
};

// ---------------- READ BY ID ----------------
exports.getPieceById = async (req, res) => {
  try {
    const id = req.params.id;
    const piece = await PieceJustificative.findByPk(id);

    if (!piece) {
      return res.status(404).json({ error: "Pièce justificative non trouvée" });
    }

    res.json(piece);
  } catch (error) {
    console.error("Erreur récupération pièce :", error);
    res
      .status(500)
      .json({ error: "Impossible de récupérer la pièce justificative" });
  }
};

// ---------------- UPDATE ----------------
exports.updatePiece = async (req, res) => {
  try {
    const id = req.params.id;
    const piece = await PieceJustificative.findByPk(id);

    if (!piece) {
      return res.status(404).json({ error: "Pièce justificative non trouvée" });
    }

    const { absence_id, motif, pieceJust_description } = req.body;

    if (req.file) {
      // Supprimer l'ancien fichier si existant
      if (piece.pieceJust_file) {
        const oldPath = path.join(
          __dirname,
          "../uploads",
          piece.pieceJust_file
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      piece.pieceJust_file = req.file.filename;
    }

    piece.absence_id = absence_id ?? piece.absence_id;
    piece.motif = motif ?? piece.motif;
    piece.pieceJust_description =
      pieceJust_description ?? piece.pieceJust_description;

    await piece.save();
    //  Mettre à jour le statut de justification de l'absence
    const absence = await Absence.findByPk(piece.absence_id);
    if (absence) {
      absence.justification_status = "Validée"; // Adaptable
      await absence.save();
    }

    res.json(piece);
  } catch (error) {
    console.error("Erreur mise à jour pièce :", error);
    res
      .status(500)
      .json({ error: "Impossible de mettre à jour la pièce justificative" });
  }
};

// ---------------- DELETE ----------------
exports.deletePiece = async (req, res) => {
  try {
    const id = req.params.id;
    const piece = await PieceJustificative.findByPk(id);

    if (!piece) {
      return res.status(404).json({ error: "Pièce justificative non trouvée" });
    }

    // Supprimer le fichier si existant
    if (piece.pieceJust_file) {
      const filePath = path.join(__dirname, "../uploads", piece.pieceJust_file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await piece.destroy();

    res.json({ message: "Pièce justificative supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression pièce :", error);
    res
      .status(500)
      .json({ error: "Impossible de supprimer la pièce justificative" });
  }
};
