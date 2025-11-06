const { Etudiant, Role } = require("../models");

exports.createEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.create(req.body);
    res.json(etudiant);
  } catch (err) {
    // 🔍 Log complet pour le debug
    console.error("❌ ERREUR DANS LA CRÉATION D'ÉTUDIANT :");
    console.error(err); // affiche tout l'objet erreur Sequelize
    if (err.errors && err.errors.length > 0) {
      err.errors.forEach((e) => {
        console.error(`⚠️ Champ : ${e.path}, Message : ${e.message}`);
      });
    }

    res.status(500).json({
      error: err.message,
      details: err.errors ? err.errors.map((e) => e.message) : [],
    });
  }
};

exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll({ include: Role });
    res.json(etudiants);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET ETUDIANTS :", err);
    res.status(500).json({ error: err.message });
  }
};
