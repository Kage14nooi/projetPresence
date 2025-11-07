const { Professeur } = require("../models");

// ➕ Créer un professeur
exports.createProfesseur = async (req, res) => {
  try {
    const prof = await Professeur.create(req.body);
    res.status(201).json(prof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Récupérer tous les professeurs
exports.getProfesseurs = async (req, res) => {
  try {
    const profs = await Professeur.findAll();
    res.json(profs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un professeur par ID
exports.getProfesseurById = async (req, res) => {
  try {
    const { id } = req.params;
    const prof = await Professeur.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });
    res.json(prof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un professeur
exports.updateProfesseur = async (req, res) => {
  try {
    const { id } = req.params;
    const prof = await Professeur.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });

    await prof.update(req.body);
    res.json({ message: "Professeur mis à jour avec succès", prof });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un professeur
exports.deleteProfesseur = async (req, res) => {
  try {
    const { id } = req.params;
    const prof = await Professeur.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });

    await prof.destroy();
    res.json({ message: "Professeur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
