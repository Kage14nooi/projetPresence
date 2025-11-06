const { PieceJustificative } = require("../models");

exports.createPiece = async (req, res) => {
  const piece = await PieceJustificative.create(req.body);
  res.json(piece);
};

exports.getPieces = async (req, res) => {
  const pieces = await PieceJustificative.findAll();
  res.json(pieces);
};
