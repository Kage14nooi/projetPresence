const { Absence, Etudiant, PieceJustificative } = require("../models");

exports.createAbsence = async (req, res) => {
  const absence = await Absence.create(req.body);
  res.json(absence);
};

exports.getAbsences = async (req, res) => {
  const absences = await Absence.findAll({
    include: [Etudiant, PieceJustificative],
  });
  res.json(absences);
};
