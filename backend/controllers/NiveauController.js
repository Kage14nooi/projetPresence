const { Niveau } = require("../models");

// ➕ Créer un Niveau
exports.createNiveau = async (req, res) => {
  try {
    const niveau = await Niveau.create(req.body);
    res.status(201).json(niveau);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Obtenir tous les niveau
exports.getNiveau = async (req, res) => {
  try {
    const niveau = await Niveau.findAll({
      order: [["niveau_nom", "ASC"]],
    });
    res.json(niveau);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un niveau par ID
exports.getNiveauById = async (req, res) => {
  try {
    const { id } = req.params;
    const niveau = await Niveau.findByPk(id);
    if (!niveau) return res.status(404).json({ error: "Niveau non trouvé" });
    res.json(niveau);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher un niveau par nom
exports.searchNiveauByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const niveau = await Niveau.findAll({ where: { niveau_nom: nom } });
    res.json(niveau);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un niveau
exports.updateNiveau = async (req, res) => {
  try {
    const { id } = req.params;
    const niveau = await Niveau.findByPk(id);
    if (!niveau) return res.status(404).json({ error: "Niveau non trouvé" });

    await niveau.update(req.body);
    res.json({ message: "Niveau mis à jour avec succès", niveau });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un niveau
exports.deleteNiveau = async (req, res) => {
  try {
    const { id } = req.params;
    const niveau = await Niveau.findByPk(id);
    if (!niveau) return res.status(404).json({ error: "Niveau non trouvé" });

    await niveau.destroy();
    res.json({ message: "Niveau supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
