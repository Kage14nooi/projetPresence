const { LogAppareil, Etudiant } = require("../models");

// ➕ Créer un log (ajout manuel ou via import de l’appareil)
exports.createLog = async (req, res) => {
  try {
    const log = await LogAppareil.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Obtenir tous les logs (avec l'étudiant associé)
exports.getLogs = async (req, res) => {
  try {
    const logs = await LogAppareil.findAll({
      include: [{ model: Etudiant }],
      order: [["date_scan", "DESC"]],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher les logs par matricule d'étudiant
exports.searchByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    const logs = await LogAppareil.findAll({
      include: [
        {
          model: Etudiant,
          where: { etudiant_matricule: matricule },
        },
      ],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher les logs d'une date spécifique
exports.searchByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const logs = await LogAppareil.findAll({
      where: { date_scan: date },
      include: [Etudiant],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un log (par ID)
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await LogAppareil.findByPk(id);

    if (!log) return res.status(404).json({ error: "Log non trouvé" });

    await log.update(req.body);
    res.json({ message: "Log mis à jour avec succès", log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un log
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await LogAppareil.findByPk(id);

    if (!log) return res.status(404).json({ error: "Log non trouvé" });

    await log.destroy();
    res.json({ message: "Log supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
