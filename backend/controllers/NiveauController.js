const {
  Niveau,
  Seance,
  Absence,
  Presence,
  Matiere,
  Etudiant,
  LogAppareil,
} = require("../models");

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
// exports.deleteNiveau = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const niveau = await Niveau.findByPk(id);
//     if (!niveau) return res.status(404).json({ error: "Niveau non trouvé" });

//     await niveau.destroy();
//     res.json({ message: "Niveau supprimé avec succès" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// NiveauController.js
exports.deleteNiveau = async (req, res) => {
  try {
    const { id } = req.params;

    const niveau = await Niveau.findByPk(id, {
      include: [
        {
          model: Matiere,
          // as: "matieres",
          include: [
            {
              model: Seance,
              // as: "seances",
              include: [
                {
                  model: Presence,
                  //  as: "presences"
                },
                {
                  model: Absence,
                  //  as: "absences"
                },
              ],
            },
          ],
        },
        {
          model: Etudiant,
          // as: "etudiants",
          include: [
            {
              model: Absence,
              // as: "absences"
            },
            {
              model: Presence,
              // as: "presences"
              //
            },
            {
              model: LogAppareil,
              //  as: "log_appareils"
              //
            },
          ],
        },
      ],
    });

    if (!niveau) return res.status(404).json({ error: "Niveau non trouvé" });

    // Supprimer toutes les absences, présences et logs des étudiants
    for (const etudiant of niveau.etudiants) {
      await Absence.destroy({ where: { etudiant_id: etudiant.etudiant_id } });
      await Presence.destroy({ where: { etudiant_id: etudiant.etudiant_id } });
      await LogAppareil.destroy({
        where: { etudiant_id: etudiant.etudiant_id },
      });
      await etudiant.destroy();
    }

    // Supprimer les seances et leurs presences/absences
    for (const matiere of niveau.matieres) {
      for (const seance of matiere.seances) {
        await Presence.destroy({ where: { seance_id: seance.seance_id } });
        await Absence.destroy({ where: { seance_id: seance.seance_id } });
        await seance.destroy();
      }
      await matiere.destroy();
    }

    // Enfin supprimer le niveau
    await niveau.destroy();

    res.json({ message: "Niveau supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteNiveau:", err);
    res.status(500).json({
      error: "Erreur serveur lors de la suppression du niveau",
      details: err.message,
    });
  }
};
