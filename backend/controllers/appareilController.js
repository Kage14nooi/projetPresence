const { Appareil, Seance } = require("../models");

// ---------------- CREATE ----------------
exports.createAppareil = async (req, res) => {
  try {
    const { appareil_nom, appareil_serie } = req.body;

    if (!appareil_nom || !appareil_serie) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newAppareil = await Appareil.create({ appareil_nom, appareil_serie });
    res.status(201).json(newAppareil);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA CREATION DE L'APPAREIL :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- READ ALL ----------------
exports.getAllAppareils = async (req, res) => {
  try {
    const appareils = await Appareil.findAll({
      include: [
        {
          model: Seance,
          //   attributes: ["seance_id", "date_seance", "heure_debut", "heure_fin"],
        },
      ],
      order: [["appareil_id", "DESC"]],
    });
    res.json(appareils);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET DES APPAREILS :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- READ BY ID ----------------
exports.getAppareilById = async (req, res) => {
  try {
    const appareil = await Appareil.findByPk(req.params.id, {
      include: [
        {
          model: Seance,
          attributes: ["seance_id", "date_seance", "heure_debut", "heure_fin"],
        },
      ],
    });
    if (!appareil)
      return res.status(404).json({ error: "Appareil non trouvé" });
    res.json(appareil);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET APPAREIL BY ID :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE ----------------
exports.updateAppareil = async (req, res) => {
  try {
    const appareil = await Appareil.findByPk(req.params.id);
    if (!appareil)
      return res.status(404).json({ error: "Appareil non trouvé" });

    await appareil.update(req.body);
    res.json(appareil);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA MISE À JOUR DE L'APPAREIL :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE ----------------
exports.deleteAppareil = async (req, res) => {
  try {
    const appareil = await Appareil.findByPk(req.params.id);
    if (!appareil)
      return res.status(404).json({ error: "Appareil non trouvé" });

    // Optionnel : supprimer ou dissocier les séances liées
    await Seance.update(
      { appareil_id: null },
      { where: { appareil_id: appareil.appareil_id } }
    );

    await appareil.destroy();
    res.json({ message: "Appareil supprimé avec succès" });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA SUPPRESSION DE L'APPAREIL :", err);
    res.status(500).json({ error: err.message });
  }
};
