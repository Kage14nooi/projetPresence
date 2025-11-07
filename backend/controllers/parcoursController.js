const { Parcours } = require("../models");

// ➕ Créer un parcours
exports.createParcours = async (req, res) => {
  try {
    const parcours = await Parcours.create(req.body);
    res.status(201).json(parcours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Obtenir tous les parcours
exports.getParcours = async (req, res) => {
  try {
    const parcours = await Parcours.findAll({
      order: [["parcours_nom", "ASC"]],
    });
    res.json(parcours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un parcours par ID
exports.getParcoursById = async (req, res) => {
  try {
    const { id } = req.params;
    const parcours = await Parcours.findByPk(id);
    if (!parcours)
      return res.status(404).json({ error: "Parcours non trouvé" });
    res.json(parcours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher un parcours par nom
exports.searchParcoursByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const parcours = await Parcours.findAll({ where: { parcours_nom: nom } });
    res.json(parcours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un parcours
exports.updateParcours = async (req, res) => {
  try {
    const { id } = req.params;
    const parcours = await Parcours.findByPk(id);
    if (!parcours)
      return res.status(404).json({ error: "Parcours non trouvé" });

    await parcours.update(req.body);
    res.json({ message: "Parcours mis à jour avec succès", parcours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un parcours
exports.deleteParcours = async (req, res) => {
  try {
    const { id } = req.params;
    const parcours = await Parcours.findByPk(id);
    if (!parcours)
      return res.status(404).json({ error: "Parcours non trouvé" });

    await parcours.destroy();
    res.json({ message: "Parcours supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
