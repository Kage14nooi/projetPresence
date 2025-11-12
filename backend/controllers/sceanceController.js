const {
  Seance,
  Presence,
  Etudiant,
  Matiere,
  Inscription,
} = require("../models");

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
    const seances = await Seance.findAll();
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

// ---------------- TOGGLE ACTIVE ----------------

exports.toggleSeanceActive = async (req, res) => {
  try {
    const seanceId = req.params.id;
    const seance = await Seance.findByPk(seanceId, {
      include: [{ model: Matiere }],
    });

    if (!seance) return res.status(404).json({ error: "Séance non trouvée" });

    // ⚡ On inverse l’état (active/désactive)
    seance.is_active = !seance.is_active;
    await seance.save();

    // ⚙️ Si la séance devient active, on crée automatiquement la fiche de présence
    if (seance.is_active) {
      // Récupérer tous les étudiants inscrits à la même matière
      const etudiants = await Etudiant.findAll({
        where: {
          parcours_id: seance.matiere.parcours_id,
          niveau_id: seance.matiere.niveau_id,
          mention_id: seance.matiere.mentions_id,
        },
      });

      // Créer une présence "A" (Absent par défaut) pour chaque étudiant
      for (const etudiant of etudiants) {
        await Presence.findOrCreate({
          where: {
            etudiant_id: etudiant.etudiant_id,
            seance_id: seance.seance_id,
          },
          defaults: {
            status: "A", // Absent par défaut
          },
        });
      }
    } else {
      // 🔕 Si on désactive la séance, on peut (au choix) supprimer les présences associées
      // await Presence.destroy({ where: { seance_id: seance.seance_id } });
    }

    res.json({
      message: seance.is_active
        ? "✅ Séance activée et fiche de présence créée."
        : "🚫 Séance désactivée.",
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
          model: Etudiant,
          attributes: ["etudiant_id", "etudiant_nom", "etudiant_prenom"],
        },
        {
          model: Seance,
          attributes: ["date_seance", "heure_debut", "heure_fin"],
        },
      ],
    });

    if (!presences.length)
      return res
        .status(404)
        .json({ message: "Aucune fiche de présence trouvée." });

    res.json(presences);
  } catch (err) {
    console.error(
      "❌ Erreur lors de la récupération de la fiche de présence :",
      err
    );
    res.status(500).json({ error: err.message });
  }
};
