const { Mentions } = require("../models");

// ➕ Créer un Mention
exports.createMention = async (req, res) => {
  try {
    const mention = await Mentions.create(req.body);
    res.status(201).json(mention);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Obtenir tous les mention
exports.getMention = async (req, res) => {
  try {
    const mention = await Mentions.findAll({
      order: [["mention_nom", "ASC"]],
    });
    res.json(mention);
    console.log("FIN ");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un mention par ID
exports.getMentionById = async (req, res) => {
  try {
    const { id } = req.params;
    const mention = await Mentions.findByPk(id);
    if (!mention) return res.status(404).json({ error: "Mention non trouvé" });
    res.json(mention);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher un mention par nom
exports.searchMentionByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const mention = await Mentions.findAll({ where: { mention_nom: nom } });
    res.json(mention);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un mention
exports.updateMention = async (req, res) => {
  try {
    const { id } = req.params;
    const mention = await Mentions.findByPk(id);
    if (!mention) return res.status(404).json({ error: "Mention non trouvé" });

    await mention.update(req.body);
    res.json({ message: "Mention mis à jour avec succès", mention });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un Mention
exports.deleteMention = async (req, res) => {
  try {
    const { id } = req.params;
    const mention = await Mentions.findByPk(id);
    if (!mention) return res.status(404).json({ error: "Mention non trouvé" });

    await mention.destroy();
    res.json({ message: "Mention supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
