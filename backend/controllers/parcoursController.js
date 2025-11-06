const { Parcours } = require("../models");

exports.createParcours = async (req, res) => {
  const parcours = await Parcours.create(req.body);
  res.json(parcours);
};

exports.getParcours = async (req, res) => {
  const parcours = await Parcours.findAll();
  res.json(parcours);
};
