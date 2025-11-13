const { Presence, Etudiant, LogAppareil } = require("../models");
const io = require("../server"); // Assurez-vous que server.js exporte io
const excelJS = require("exceljs"); // npm install exceljs

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

exports.exportFicheExcel = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer toutes les présences de la séance
    const presences = await Presence.findAll({
      where: { seance_id: id },
      include: Etudiant,
    });

    // Créer le workbook
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fiche Présence");

    // Colonnes
    worksheet.columns = [
      { header: "ID Étudiant", key: "etudiant_id", width: 15 },
      { header: "Nom Étudiant", key: "nom", width: 25 },
      { header: "Prénom Étudiant", key: "prenom", width: 25 },
      { header: "Heure Entrée", key: "heure_entree", width: 15 },
      { header: "Heure Sortie", key: "heure_sortie", width: 15 },
      { header: "Statut", key: "status", width: 10 },
    ];

    // Ajouter les lignes
    presences.forEach((p) => {
      worksheet.addRow({
        etudiant_id: p.etudiant_id,
        nom: p.etudiant?.etudiant_nom || "",
        prenom: p.etudiant?.etudiant_prenom || "",
        heure_entree: p.heure_entree || "",
        heure_sortie: p.heure_sortie || "",
        status: p.status,
      });
    });

    // Headers pour l'export
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fiche_presence_seance_${id}.xlsx`
    );

    // Envoyer le fichier Excel au client
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Erreur export Excel :", error);
    res.status(500).json({ error: "Impossible d'exporter la fiche" });
  }
};
