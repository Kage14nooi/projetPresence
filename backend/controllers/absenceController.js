const {
  Absence,
  Etudiant,
  PieceJustificative,
  Presence,
  Niveau,
  Parcours,
  Mentions,
  Seance,
  Matiere,
} = require("../models");
const { Op } = require("sequelize");

// ➕ Créer une absence manuellement
exports.createAbsence = async (req, res) => {
  try {
    const absence = await Absence.create(req.body);
    res.status(201).json(absence);
  } catch (err) {
    console.error("Erreur création absence :", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer toutes les absences avec leurs relations
exports.getAbsences = async (req, res) => {
  try {
    const absences = await Absence.findAll({
      include: [
        {
          model: Etudiant,
          attributes: [
            "etudiant_id",
            "etudiant_nom",
            "etudiant_prenom",
            "etudiant_matricule",
          ],
          include: [
            {
              model: Niveau,
              as: "niveau",
              attributes: ["niveau_nom"],
            },
            {
              model: Parcours,
              as: "parcour",
              attributes: ["parcours_nom"],
            },
            {
              model: Mentions,
              as: "mention",
              attributes: ["mention_nom"],
            },
          ],
        },
        {
          model: PieceJustificative,
          attributes: [
            "pieceJust_id",
            "pieceJust_description",
            "motif",
            "pieceJust_file",
          ],
        },
        {
          model: Seance,
          attributes: [
            "seance_id",
            "date_seance",
            "heure_debut",
            "heure_fin",
            "matiere_id",
          ],
          include: [
            {
              model: Matiere,
              as: "matiere",
              attributes: ["matiere_nom"],
            },
          ],
        },
      ],
      order: [["absence_id", "DESC"]],
    });

    res.json(absences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer une absence par ID
exports.getAbsenceById = async (req, res) => {
  try {
    const absence = await Absence.findByPk(req.params.id, {
      include: [Etudiant, PieceJustificative],
    });
    if (!absence)
      return res.status(404).json({ message: "Absence non trouvée" });
    res.json(absence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une absence
exports.updateAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByPk(req.params.id);
    if (!absence)
      return res.status(404).json({ message: "Absence non trouvée" });

    await absence.update(req.body);
    res.json({ message: "Absence mise à jour avec succès", absence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer une absence
exports.deleteAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByPk(req.params.id);
    if (!absence)
      return res.status(404).json({ message: "Absence non trouvée" });

    await absence.destroy();
    res.json({ message: "Absence supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔎 Rechercher des absences (nom, matricule, statut, justification)
exports.searchAbsences = async (req, res) => {
  try {
    const { nom, matricule, statut, justification_status } = req.query;

    const where = {};
    if (statut) where.statut = statut;
    if (justification_status) where.justification_status = justification_status;

    const absences = await Absence.findAll({
      where,
      include: [
        {
          model: Etudiant,
          where: {
            ...(nom ? { etudiant_nom: { [Op.like]: `%${nom}%` } } : {}),
            ...(matricule ? { etudiant_matricule: matricule } : {}),
          },
        },
        PieceJustificative,
      ],
    });

    res.json(absences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Générer des absences automatiquement selon la fiche de présence
exports.generateAbsences = async (req, res) => {
  try {
    const { seance_id } = req.params;

    // Récupérer toutes les présences pour cette séance
    const presences = await Presence.findAll({ where: { seance_id } });

    // Filtrer les étudiants absents (status = "A")
    const absents = presences.filter((p) => p.status === "A");

    const absencesCreated = [];

    for (const p of absents) {
      // Vérifier qu'une absence n'existe pas déjà pour cet étudiant et cette séance
      const existing = await Absence.findOne({
        where: { etudiant_id: p.etudiant_id, seance_id },
      });
      if (existing) continue;

      const absence = await Absence.create({
        etudiant_id: p.etudiant_id,
        seance_id,
        statut: "Absent",
        justification_status: "En attente",
      });

      absencesCreated.push(absence);
    }

    res.json({
      message: "Absences générées automatiquement depuis la fiche de présence",
      total_absents: absents.length,
      absences: absencesCreated,
    });
  } catch (err) {
    console.error("Erreur lors de la génération des absences:", err);
    res.status(500).json({ error: err.message });
  }
};
