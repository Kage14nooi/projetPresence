const { Etudiant, Role } = require("../models");

// ---------------- CREATE ----------------
exports.createEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.create(req.body);
    res.json(etudiant);
  } catch (err) {
    console.error("❌ ERREUR DANS LA CRÉATION D'ÉTUDIANT :", err);
    if (err.errors) {
      err.errors.forEach((e) => {
        console.error(`⚠️ Champ : ${e.path}, Message : ${e.message}`);
      });
    }
    res.status(500).json({
      error: err.message,
      details: err.errors ? err.errors.map((e) => e.message) : [],
    });
  }
};

// ---------------- READ ALL ----------------
exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll({ include: Role });
    res.json(etudiants);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET ETUDIANTS :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- READ BY ID ----------------
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id, { include: Role });
    if (!etudiant)
      return res.status(404).json({ error: "Étudiant non trouvé" });
    res.json(etudiant);
  } catch (err) {
    console.error("❌ ERREUR LORS DU GET ETUDIANT BY ID :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE ----------------
exports.updateEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant)
      return res.status(404).json({ error: "Étudiant non trouvé" });

    await etudiant.update(req.body);
    res.json(etudiant);
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA MISE À JOUR D'ÉTUDIANT :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE ----------------
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant)
      return res.status(404).json({ error: "Étudiant non trouvé" });

    // La suppression cascade supprimera automatiquement toutes les présences, absences, notifications et logs liés
    await etudiant.destroy();

    res.json({
      message: "Étudiant et toutes ses dépendances supprimés avec succès",
    });
  } catch (err) {
    console.error("❌ ERREUR LORS DE LA SUPPRESSION D'ÉTUDIANT :", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- FILTRE SIMPLE ----------------
exports.filterEtudiants = async (req, res) => {
  try {
    const { nom, prenom, role_id } = req.query;
    const where = {};
    if (nom) where.etudiant_nom = nom;
    if (prenom) where.etudiant_prenom = prenom;
    if (role_id) where.role_id = role_id;

    const etudiants = await Etudiant.findAll({ where, include: Role });
    res.json(etudiants);
  } catch (err) {
    console.error("❌ ERREUR LORS DU FILTRAGE D'ÉTUDIANTS :", err);
    res.status(500).json({ error: err.message });
  }
};
