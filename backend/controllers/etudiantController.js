const { Etudiant, Role } = require("../models");

exports.createEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.create(req.body);
    res.json(etudiant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll({ include: Role });
    res.json(etudiants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
