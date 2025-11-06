const { Matiere, Professeur, Parcours } = require("../models");

exports.createMatiere = async (req, res) => {
  const matiere = await Matiere.create(req.body);
  res.json(matiere);
};

exports.getMatieres = async (req, res) => {
  const matieres = await Matiere.findAll({ include: [Professeur, Parcours] });
  res.json(matieres);
};
