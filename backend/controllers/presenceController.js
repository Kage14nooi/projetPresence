const { Presence, Etudiant, LogAppareil } = require("../models");
const io = require("../server"); // Assurez-vous que server.js exporte io

// ➕ Ajouter / recevoir une présence depuis le Fingerprint Clock
exports.uploadPresence = async (req, res) => {
  try {
    const { etudiant_id, matiere_id, timestamp, status } = req.body;

    const etudiant = await Etudiant.findByPk(etudiant_id);
    if (!etudiant) return res.status(400).json({ error: "Etudiant inconnu" });

    // Créer la présence
    const presence = await Presence.create({
      etudiant_id,
      matiere_id,
      date_presence: timestamp.split("T")[0],
      heure_entree: timestamp.split("T")[1],
      status,
    });

    // Enregistrer le log de l'appareil
    await LogAppareil.create({ etudiant_id, matiere_id, timestamp });

    // Envoi temps réel au front
    // misy modif be
    // req.io.emit("new_presence", { etudiant, presence });

    res.status(201).json({ status: "ok", presence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Récupérer toutes les présences
exports.getPresences = async (req, res) => {
  try {
    const presences = await Presence.findAll({ include: Etudiant });
    res.json(presences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer une présence par ID
exports.getPresenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const presence = await Presence.findByPk(id, { include: Etudiant });
    if (!presence)
      return res.status(404).json({ error: "Présence non trouvée" });
    res.json(presence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher les présences d’un étudiant
exports.getPresencesByEtudiant = async (req, res) => {
  try {
    const { etudiant_id } = req.params;
    const presences = await Presence.findAll({
      where: { etudiant_id },
      include: Etudiant,
    });
    res.json(presences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une présence
exports.updatePresence = async (req, res) => {
  try {
    const { id } = req.params;
    const presence = await Presence.findByPk(id);
    if (!presence)
      return res.status(404).json({ error: "Présence non trouvée" });

    await presence.update(req.body);
    res.json({ message: "Présence mise à jour avec succès", presence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une présence
exports.deletePresence = async (req, res) => {
  try {
    const { id } = req.params;
    const presence = await Presence.findByPk(id);
    if (!presence)
      return res.status(404).json({ error: "Présence non trouvée" });

    await presence.destroy();
    res.json({ message: "Présence supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
