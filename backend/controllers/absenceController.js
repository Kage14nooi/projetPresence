const {
  Absence,
  Etudiant,
  PieceJustificative,
  Presence,
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
            "etudiant_niveau",
            "etudiant_parcours",
          ],
        },
        {
          model: PieceJustificative,
          attributes: ["pieceJust_id", "pieceJust_description"],
        },
      ],
      order: [["date_absence", "DESC"]],
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

// 🔎 Rechercher des absences (nom, matricule, date, motif)
exports.searchAbsences = async (req, res) => {
  try {
    const { nom, matricule, date, motif } = req.query;

    const where = {};
    if (date) where.date_absence = date;
    if (motif) where.motif = motif;

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

exports.generateAbsences = async (req, res) => {
  try {
    const { matiere_id, date } = req.body;

    console.log("===== Génération des absences =====");
    console.log("Matière ID:", matiere_id, "Date:", date);

    // Récupérer tous les étudiants
    const etudiants = await Etudiant.findAll();
    console.log(
      "Étudiants dans la base:",
      etudiants.map((e) => ({
        id: e.etudiant_id,
        nom: e.etudiant_nom,
      }))
    );

    // Récupérer toutes les présences pour cette matière et cette date
    const presences = await Presence.findAll({
      where: { matiere_id, date_presence: date },
    });

    console.log(
      "Présences enregistrées:",
      presences.map((p) => ({
        etudiant_id: p.etudiant_id,
        status: p.status,
      }))
    );

    // Extraire les IDs des étudiants présents en s'assurant que ce sont des nombres
    const presentIds = presences
      .map((p) => Number(p.etudiant_id))
      .filter((id) => !isNaN(id));

    console.log("IDs des étudiants présents:", presentIds);

    // Trouver les absents
    const absents = etudiants.filter(
      (e) =>
        e.etudiant_id != null && !presentIds.includes(Number(e.etudiant_id))
    );

    console.log(
      "Étudiants absents:",
      absents.map((e) => ({
        id: e.etudiant_id,
        nom: e.etudiant_nom,
      }))
    );

    const absencesCreated = [];

    for (const e of absents) {
      // Vérifier qu'il n'existe pas déjà une absence pour ce jour et cette matière
      const existing = await Absence.findOne({
        where: { etudiant_id: e.etudiant_id, date_absence: date, matiere_id },
      });
      if (existing) {
        console.log("Absence déjà existante pour étudiant_id:", e.etudiant_id);
        continue;
      }

      const absence = await Absence.create({
        etudiant_id: e.etudiant_id,
        matiere_id,
        date_absence: date,
        motif: "Non justifié",
      });

      console.log("Absence créée pour étudiant_id:", e.etudiant_id);
      absencesCreated.push(absence);
    }

    res.json({
      message: "Absences générées automatiquement",
      total_absents: absents.length,
      absences: absencesCreated,
    });
  } catch (err) {
    console.error("Erreur lors de la génération des absences:", err);
    res.status(500).json({ error: err.message });
  }
};
