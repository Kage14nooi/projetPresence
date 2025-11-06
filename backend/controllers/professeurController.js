const { Professeur } = require("../models");

exports.createProfesseur = async (req, res) => {
  const prof = await Professeur.create(req.body);
  res.json(prof);
};

exports.getProfesseurs = async (req, res) => {
  const profs = await Professeur.findAll();
  res.json(profs);
};
