const { LogAppareil, Etudiant } = require("../models");

exports.getLogs = async (req, res) => {
  const logs = await LogAppareil.findAll({ include: Etudiant });
  res.json(logs);
};
