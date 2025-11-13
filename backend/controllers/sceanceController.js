const { Seance, Presence, Etudiant, Matiere } = require("../models");

// ---------------- CREATE ----------------
exports.createSeance = async (req, res) => {
  try {
    const { matiere_id, date_seance, heure_debut, heure_fin } = req.body;

    if (!matiere_id || !date_seance || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Vérifier si la séance existe déjà
    const existingSeance = await Seance.findOne({
      where: { matiere_id, date_seance, heure_debut },
    });

    if (existingSeance) {
      return res.status(409).json({ message: "Cette séance existe déjà." });
    }

    const newSeance = await Seance.create({
      matiere_id,
      date_seance,
      heure_debut,
      heure_fin,
    });

    res.status(201).json(newSeance);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA CREATION DE SEANCE :", err);
    res.status(500).json({
      error: err.message,
      details: err.errors ? err.errors.map((e) => e.message) : [],
    });
  }
};

// ---------------- READ ALL ----------------
exports.getAllSeances = async (req, res) => {
  try {
    const seances = await Seance.findAll({
      include: [
        {
          model: Matiere,
          as: "matiere", // doit correspondre à l'alias défini dans Seance.belongsTo
          attributes: ["matiere_nom"], // récupère uniquement le nom de la matière
        },
      ],
    });

    res.json(seances);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET SEANCES :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- READ BY ID ----------------
exports.getSeanceById = async (req, res) => {
  try {
    const seance = await Seance.findByPk(req.params.id);
    if (!seance) return res.status(404).json({ error: "Séance non trouvée" });
    res.json(seance);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET SEANCE BY ID :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE ----------------
exports.updateSeance = async (req, res) => {
  try {
    const seance = await Seance.findByPk(req.params.id);
    if (!seance) return res.status(404).json({ error: "Séance non trouvée" });

    await seance.update(req.body);
    res.json(seance);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA MISE À JOUR DE SEANCE :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE ----------------
exports.deleteSeance = async (req, res) => {
  try {
    const seance = await Seance.findByPk(req.params.id);
    if (!seance) return res.status(404).json({ error: "Séance non trouvée" });

    await seance.destroy();
    res.json({ message: "Séance supprimée avec succès" });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA SUPPRESSION DE SEANCE :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.toggleSeanceActive = async (req, res) => {
  try {
    const seanceId = req.params.id;

    // 🔍 Récupérer la séance + matière associée
    const seance = await Seance.findByPk(seanceId, {
      include: [{ model: Matiere }],
    });

    if (!seance) {
      return res.status(404).json({ error: "Séance non trouvée" });
    }

    // ⚙️ Inverser l’état actif/inactif
    seance.is_active = !seance.is_active;
    await seance.save();

    // ✅ Si la séance devient active → création des fiches de présence
    if (seance.is_active) {
      const matiere = seance.matiere;

      if (!matiere) {
        return res.status(400).json({
          error:
            "Impossible de créer la fiche de présence : aucune matière liée à cette séance.",
        });
      }

      // 🎓 Récupérer tous les étudiants du même parcours/mention/niveau
      const etudiants = await Etudiant.findAll({
        where: {
          parcours_id: matiere.parcours_id,
          mention_id: matiere.mention_id,
          niveau_id: matiere.niveau_id,
        },
      });

      if (etudiants.length === 0) {
        return res.status(200).json({
          message:
            "Séance activée, mais aucun étudiant trouvé correspondant aux critères.",
          seance,
        });
      }

      // 🧾 Créer la présence pour chaque étudiant (Absent par défaut)
      for (const etudiant of etudiants) {
        await Presence.findOrCreate({
          where: {
            etudiant_id: etudiant.etudiant_id,
            seance_id: seance.seance_id,
          },
          defaults: {
            status: "A", // Absent par défaut
            heure_entree: null,
            heure_sortie: null,
          },
        });
      }

      return res.json({
        message: `✅ Séance activée (${etudiants.length} fiches de présence créées).`,
        seance,
      });
    }

    // 🚫 Si la séance est désactivée
    return res.json({
      message: "🚫 Séance désactivée avec succès.",
      seance,
    });
  } catch (err) {
    console.error("❌ ERREUR LORS DU TOGGLE DE SÉANCE :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPresenceBySeance = async (req, res) => {
  try {
    const seanceId = req.params.id;

    const presences = await Presence.findAll({
      where: { seance_id: seanceId },
      include: [
        {
          model: Etudiant, // ✅ Inclut TOUS les champs de l'étudiant
        },
        {
          model: Seance, // ✅ Inclut TOUS les champs de la séance
        },
      ],
    });

    if (!presences.length) {
      return res
        .status(404)
        .json({ message: "Aucune fiche de présence trouvée." });
    }

    res.json(presences);
  } catch (err) {
    console.error(
      "❌ Erreur lors de la récupération de la fiche de présence :",
      err
    );
    res.status(500).json({ error: err.message });
  }
};
// controllers/seanceController.js
exports.getSeanceAbsents = async (req, res) => {
  try {
    const seanceId = req.params.id;

    const presences = await Presence.findAll({
      where: { seance_id: seanceId, status: "A" }, // uniquement les absents
      include: [
        {
          model: Etudiant,
          as: "etudiant", // ⚠️ doit correspondre à l'alias
          attributes: [
            "etudiant_id",
            "etudiant_nom",
            "etudiant_prenom",
            "etudiant_mail",
          ],
        },
      ],
    });

    if (!presences.length) {
      return res.status(404).json({ message: "Aucun absent trouvé." });
    }

    // renvoyer uniquement les infos étudiant
    const absents = presences.map((p) => p.etudiant);

    res.json(absents);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des absents :", err);
    res.status(500).json({ error: err.message });
  }
};
