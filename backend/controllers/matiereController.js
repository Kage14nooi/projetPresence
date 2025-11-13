const {
  Matiere,
  Professeur,
  Parcours,
  Presence,
  Etudiant,
  Seance,
  Niveau,
  Mentions,
} = require("../models");

// ---------------- CREATE ----------------

exports.createMatiere = async (req, res) => {
  try {
    const { matiere_nom, professeur_id, parcours_id, mention_id, niveau_id } =
      req.body;

    // Vérifier les champs obligatoires
    if (!matiere_nom || !professeur_id || !parcours_id || !niveau_id) {
      return res
        .status(400)
        .json({ message: "Champs obligatoires manquants." });
    }

    // Vérifier si la matière existe déjà
    const existing = await Matiere.findOne({
      where: { matiere_nom, professeur_id, parcours_id, mention_id, niveau_id },
    });

    if (existing) {
      return res.status(409).json({ message: "Cette matière existe déjà." });
    }

    // Création de la matière
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA CREATION DE MATIERE :", err);
    res.status(500).json({
      error: err.message,
      details: err.errors ? err.errors.map((e) => e.message) : [],
    });
  }
};

// ---------------- READ ALL ----------------
exports.getMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.findAll({
      include: [
        { model: Seance, as: "seances" }, // séances associées
        { model: Professeur }, // professeur associé
        { model: Parcours }, // parcours associé
        { model: Niveau }, // niveau associé
        { model: Mentions }, // mention associée
      ],
    });
    res.json(matieres);
  } catch (error) {
    console.error("Erreur getMatieres:", error);
    res.status(500).json({ message: "Erreur lors du chargement des matières" });
  }
};
// ---------------- READ BY ID ----------------
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id, {
      include: [Professeur, Parcours],
    });
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });
    res.json(matiere);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET MATIERE BY ID :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- SEARCH BY NOM ----------------
exports.searchByNom = async (req, res) => {
  try {
    const matieres = await Matiere.findAll({
      where: { matiere_nom: req.params.nom },
      include: [Professeur, Parcours],
    });
    res.json(matieres);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA RECHERCHE MATIERE PAR NOM :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- SEARCH BY PARCOURS ----------------
exports.searchByParcours = async (req, res) => {
  try {
    const matieres = await Matiere.findAll({
      where: { parcours_id: req.params.parcoursId },
      include: [Professeur, Parcours],
    });
    res.json(matieres);
  } catch (err) {
    console.error(
      "❌ ERREUR LORS DE LA RECHERCHE MATIERES PAR PARCOURS :",
      err
    );
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE ----------------
exports.updateMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });

    await matiere.update(req.body);
    res.json({ message: "Matière mise à jour avec succès", matiere });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA MISE À JOUR DE MATIERE :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE ----------------
exports.deleteMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });

    await matiere.destroy();
    res.json({ message: "Matière supprimée avec succès" });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA SUPPRESSION DE MATIERE :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- FICHE DE PRESENCE ----------------
exports.getFichePresenceByMatiere = async (req, res) => {
  try {
    const matiereId = req.params.id;

    // Vérifier que la matière existe
    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) return res.status(404).json({ error: "Matière non trouvée" });

    // ✅ Récupérer les présences via les séances de cette matière
    const presences = await Presence.findAll({
      include: [
        {
          model: Etudiant,
          attributes: ["etudiant_id", "etudiant_nom", "etudiant_prenom"],
        },
        {
          model: Seance,
          attributes: ["seance_id", "date_seance", "heure_debut", "heure_fin"],
          where: { matiere_id: matiereId },
        },
      ],
      order: [[{ model: Seance }, "date_seance", "ASC"]],
    });

    res.json({ matiere, presences });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA FICHE DE PRESENCE :", err);
    res.status(500).json({ error: err.message });
  }
};
