const {
  Seance,
  Presence,
  Etudiant,
  Matiere,
  Mentions,
  Parcours,
  Niveau,
  Professeur,
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
    const seances = await Seance.findAll({
      include: [
        {
          model: Matiere,
          as: "matiere", // ⚠️ doit être identique à l'alias dans ton association
          attributes: ["matiere_nom"],
          include: [
            {
              model: Mentions,
              attributes: ["mention_nom"],
            },
            {
              model: Parcours,
              attributes: ["parcours_nom"],
            },
            {
              model: Niveau,
              attributes: ["niveau_nom"],
            },
          ],
        },
      ],
      order: [["seance_id", "DESC"]],
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

    await seance.destroy(); // ← Les Presence, Absence et LogAppareil seront supprimés automatiquement
    res.json({ message: "Séance supprimée avec succès" });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA SUPPRESSION DE SEANCE :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.toggleSeanceActive = async (req, res) => {
  try {
    const seanceId = req.params.id;
    const seance = await Seance.findByPk(seanceId, {
      include: [{ model: Matiere, as: "matiere" }],
    });
    if (!seance) return res.status(404).json({ error: "Séance non trouvée" });

    const now = new Date();
    const seanceDateFin = new Date(seance.date_seance);
    const [heureFinH, heureFinM] = seance.heure_fin.split(":").map(Number);
    seanceDateFin.setHours(heureFinH, heureFinM, 0, 0);

    const isSeanceTerminee = now >= seanceDateFin;

    // 🚫 Séance terminée et inactive → impossible d'activer
    console.log("aty amin back ", seances.is_active);

    if (isSeanceTerminee && !seance.is_active) {
      console.log("anaty condition");
      // Créer les absences pour les étudiants absents
      console.log("anaty condion", seance.seance_id);
      const presencesAbsentes = await Presence.findAll({
        where: { seance_id: seance.seance_id, status: "A" },
      });

      for (const presence of presencesAbsentes) {
        await Absence.findOrCreate({
          where: {
            etudiant_id: presence.etudiant_id,
            seance_id: seance.seance_id,
          },
          defaults: { statut: "Absent", justification_status: "En attente" },
        });
      }

      return res.status(400).json({
        error: "Impossible d'activer une séance terminée",
        message: "Les absences ont été enregistrées automatiquement",
        seance,
      });
    }

    // 🔄 Séance terminée et active → désactiver automatiquement
    if (isSeanceTerminee && seance.is_active) {
      seance.is_active = false;
      await seance.save();

      const presencesAbsentes = await Presence.findAll({
        where: { seance_id: seance.seance_id, status: "A" },
      });

      for (const presence of presencesAbsentes) {
        await Absence.findOrCreate({
          where: {
            etudiant_id: presence.etudiant_id,
            seance_id: seance.seance_id,
          },
          defaults: { statut: "Absent", justification_status: "En attente" },
        });
      }

      return res.json({
        message:
          "Séance terminée → désactivée automatiquement et absences enregistrées",
        seance,
      });
    }

    // 🔧 Toggle normal pour séance non terminée
    seance.is_active = !seance.is_active;
    await seance.save();

    // ✅ Si activation normale → créer fiches de présence
    if (seance.is_active) {
      const matiere = seance.matiere;
      if (!matiere)
        return res.status(400).json({ error: "Aucune matière associée" });

      const etudiants = await Etudiant.findAll({
        where: {
          parcours_id: matiere.parcours_id,
          mention_id: matiere.mention_id,
          niveau_id: matiere.niveau_id,
        },
      });

      for (const etudiant of etudiants) {
        await Presence.findOrCreate({
          where: {
            etudiant_id: etudiant.etudiant_id,
            seance_id: seance.seance_id,
          },
          defaults: { status: "A", heure_entree: null, heure_sortie: null },
        });
      }

      return res.json({
        message: `Séance activée (${etudiants.length} fiches de présence créées)`,
        seance,
      });
    }

    // 🚫 Désactivation normale
    return res.json({ message: "Séance désactivée avec succès", seance });
  } catch (err) {
    console.error("ERREUR toggleSeanceActive :", err);
    return res.status(500).json({ error: err.message });
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
          // as: "etudiant",
          attributes: [
            "etudiant_id",
            "etudiant_matricule",
            "etudiant_nom",
            "etudiant_prenom",
          ],
          include: [
            { model: Parcours, attributes: ["parcours_nom"] },
            { model: Mentions, attributes: ["mention_nom"] },
            { model: Niveau, attributes: ["niveau_nom"] },
          ],
        },
        {
          model: Seance,
          // as: "seance",
          attributes: ["seance_id", "date_seance", "heure_debut", "heure_fin"],
          include: [
            {
              model: Matiere,
              // as: "matiere",
              attributes: ["matiere_id", "matiere_nom"],
              include: [
                {
                  model: Professeur,
                  attributes: ["professeur_nom"],
                },
                { model: Parcours, attributes: ["parcours_nom"] },
                { model: Niveau, attributes: ["niveau_nom"] },
                { model: Mentions, attributes: ["mention_nom"] },
              ],
            },
          ],
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
          // as: "etudiant", // ⚠️ doit correspondre à l'alias
          attributes: [
            "etudiant_id",
            "etudiant_nom",
            "etudiant_prenom",
            "etudiant_mail",
            "etudiant_matricule",
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
// Fonction pour désactiver automatiquement les séances terminées
exports.checkAndCloseExpiredSeances = async (req, res) => {
  try {
    const now = new Date();

    // Récupérer toutes les séances actives
    const seancesActives = await Seance.findAll({
      where: { is_active: true },
      include: [
        {
          model: Matiere,
          // as: "matiere"
          //
        },
      ],
    });

    let seancesDesactivees = 0;
    let absencesTotales = 0;

    for (const seance of seancesActives) {
      const seanceDate = new Date(seance.date_seance);
      const [heureFinHours, heureFinMinutes] = seance.heure_fin.split(":");
      seanceDate.setHours(
        parseInt(heureFinHours),
        parseInt(heureFinMinutes),
        0,
        0
      );

      // Si la séance est terminée
      if (now > seanceDate) {
        // Désactiver la séance
        seance.is_active = false;
        await seance.save();
        seancesDesactivees++;

        // Créer les absences
        const presencesAbsentes = await Presence.findAll({
          where: {
            seance_id: seance.seance_id,
            status: "A",
          },
        });

        for (const presence of presencesAbsentes) {
          const [absence, created] = await Absence.findOrCreate({
            where: {
              etudiant_id: presence.etudiant_id,
              seance_id: seance.seance_id,
            },
            defaults: {
              statut: "Absent",
              justification_status: "En attente",
            },
          });

          if (created) {
            absencesTotales++;

            // Notification
            await Notification.create({
              etudiant_id: presence.etudiant_id,
              objet: "Absence enregistrée",
              description: `Vous avez été marqué absent pour la séance du ${seance.date_seance}.`,
              date_envoi: new Date(),
            });
          }
        }
      }
    }

    res.json({
      message: `✅ Vérification terminée.`,
      seancesDesactivees,
      absencesCreees: absencesTotales,
    });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA VÉRIFICATION DES SÉANCES :", err);
    res.status(500).json({ error: err.message });
  }
};
