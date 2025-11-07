const { Matiere, Professeur, Parcours } = require("../models");

// ➕ Créer une matière
exports.createMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Obtenir toutes les matières (avec Professeur et Parcours associés)
exports.getMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.findAll({
      include: [Professeur, Parcours],
      order: [["nom_matiere", "ASC"]],
    });
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher une matière par ID
exports.getMatiereById = async (req, res) => {
  try {
    const { id } = req.params;
    const matiere = await Matiere.findByPk(id, {
      include: [Professeur, Parcours],
    });
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });
    res.json(matiere);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher une matière par nom
exports.searchByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const matieres = await Matiere.findAll({
      where: { nom_matiere: nom },
      include: [Professeur, Parcours],
    });
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher les matières d’un parcours donné
exports.searchByParcours = async (req, res) => {
  try {
    const { parcoursId } = req.params;
    const matieres = await Matiere.findAll({
      where: { parcours_id: parcoursId },
      include: [Professeur, Parcours],
    });
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une matière
exports.updateMatiere = async (req, res) => {
  try {
    const { id } = req.params;
    const matiere = await Matiere.findByPk(id);
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });

    await matiere.update(req.body);
    res.json({ message: "Matière mise à jour avec succès", matiere });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une matière
exports.deleteMatiere = async (req, res) => {
  try {
    const { id } = req.params;
    const matiere = await Matiere.findByPk(id);
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });

    await matiere.destroy();
    res.json({ message: "Matière supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
