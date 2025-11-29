const {
  LogAppareil,
  Etudiant,
  Seance,
  Presence,
  Matiere,
} = require("../models");

// ========================================
// Créer un log reçu de l'appareil
// ========================================
// exports.createLog = async (req, res) => {
//   try {
//     // 1️⃣ Récupérer les données envoyées par l'appareil
//     // Exemple JSON attendu de l'appareil :
//     // {
//     //   "device_id": "DSK1T804AMF1",
//     //   "user_id": "1001",
//     //   "event_type": "Fingerprint",
//     //   "direction": "IN",
//     //   "timestamp": "2025-11-12T15:42:00Z"
//     // }
//     console.log("🚀 Requête reçue depuis l'appareil :", req.body);

//     const { device_id, user_id, event_type, direction, timestamp } = req.body;

//     // 2️⃣ Vérifier que l'étudiant existe via device_user_id
//     const etudiant = await Etudiant.findOne({
//       where: { device_user_id: user_id },
//     });
//     if (!etudiant) {
//       return res
//         .status(404)
//         .json({ error: "Étudiant non trouvé pour cet ID appareil" });
//     }

//     // 3️⃣ Trouver la séance active pour cet étudiant (seance is_active = true)
//     const seanceActive = await Seance.findOne({
//       where: { is_active: true },
//       include: [
//         {
//           model: Matiere, // <--- corrigé ici
//           required: true,
//           attributes: ["matiere_id", "parcours_id", "niveau_id", "mention_id"],
//         },
//       ],
//     });

//     // Filtrer ensuite en JS si besoin
//     const seanceFiltrée =
//       seanceActive &&
//       seanceActive.matiere.parcours_id === etudiant.parcours_id &&
//       seanceActive.matiere.niveau_id === etudiant.niveau_id &&
//       seanceActive.matiere.mention_id === etudiant.mention_id
//         ? seanceActive
//         : null;

//     // 4️⃣ Créer le log dans la table LogAppareil
//     const log = await LogAppareil.create({
//       device_id,
//       user_id,
//       etudiant_id: etudiant.etudiant_id,
//       seance_id: seanceActive ? seanceActive.seance_id : null,
//       matiere_id: req.body.matiere_id || null,
//       event_type,
//       direction,
//       timestamp,
//       raw_data: req.body, // garde tout le JSON reçu pour debug
//     });

//     // 5️⃣ Mettre à jour la présence si une séance active existe
//     if (seanceActive) {
//       // Chercher si la présence existe déjà pour cet étudiant et séance
//       let presence = await Presence.findOne({
//         where: {
//           etudiant_id: etudiant.etudiant_id,
//           seance_id: seanceActive.seance_id,
//         },
//       });

//       if (!presence) {
//         // Créer une nouvelle présence (A par défaut)
//         presence = await Presence.create({
//           etudiant_id: etudiant.etudiant_id,
//           seance_id: seanceActive.seance_id,
//           status: "P", // l'étudiant est présent
//           heure_entree: timestamp, // on prend l'heure du log
//           heure_sortie: null, // à remplir plus tard si direction = OUT
//         });
//       } else {
//         // Mettre à jour la présence existante
//         if (direction === "IN") presence.heure_entree = timestamp;
//         if (direction === "OUT") presence.heure_sortie = timestamp;
//         presence.status = "P"; // s'assurer que la présence est à jour
//         await presence.save();
//       }
//     }

//     res.status(201).json({ message: "Log reçu et traité", log });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// 🟦 Version 1 — Données envoyées en USB via Serial → NodeJS

exports.createLog = async (req, res) => {
  try {
    // 1️⃣ Données reçues depuis le script NodeJS qui lit l'Arduino
    // Structure : { device_id, user_id, event_type, direction, timestamp }
    console.log("📥 Données reçues (USB Serial) :", req.body);

    const { device_id, user_id, event_type, direction, timestamp } = req.body;

    // 2️⃣ Vérifier l'étudiant via l'user_id envoyé par l'Arduino
    const etudiant = await Etudiant.findOne({
      where: { device_user_id: user_id },
    });

    if (!etudiant) {
      return res.status(404).json({
        error: "Étudiant non trouvé pour cet ID envoyé par l'appareil",
      });
    }

    // 3️⃣ Trouver la séance active
    const seanceActive = await Seance.findOne({
      where: { is_active: true },
      include: [
        {
          model: Matiere,
          required: true,
          attributes: ["matiere_id", "parcours_id", "niveau_id", "mention_id"],
        },
      ],
    });

    // Vérification parcours/niveau/mention
    const seanceFiltrée =
      seanceActive &&
      seanceActive.matiere.parcours_id === etudiant.parcours_id &&
      seanceActive.matiere.niveau_id === etudiant.niveau_id &&
      seanceActive.matiere.mention_id === etudiant.mention_id
        ? seanceActive
        : null;

    // 4️⃣ Enregistrer le log
    const log = await LogAppareil.create({
      device_id,
      user_id,
      etudiant_id: etudiant.etudiant_id,
      seance_id: seanceFiltrée ? seanceFiltrée.seance_id : null,
      matiere_id: req.body.matiere_id || null,
      event_type,
      direction,
      timestamp,
      raw_data: req.body,
    });

    // 5️⃣ Mise à jour de présence
    if (seanceFiltrée) {
      let presence = await Presence.findOne({
        where: {
          etudiant_id: etudiant.etudiant_id,
          seance_id: seanceFiltrée.seance_id,
        },
      });

      if (!presence) {
        presence = await Presence.create({
          etudiant_id: etudiant.etudiant_id,
          seance_id: seanceFiltrée.seance_id,
          status: "P",
          heure_entree: direction === "IN" ? timestamp : null,
          heure_sortie: direction === "OUT" ? timestamp : null,
        });
      } else {
        if (direction === "IN") presence.heure_entree = timestamp;
        if (direction === "OUT") presence.heure_sortie = timestamp;
        presence.status = "P";
        await presence.save();
      }
    }

    return res.status(201).json({ message: "Log USB traité", log });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// ========================================
// Récupérer tous les logs (avec étudiant)
// ========================================
exports.getLogs = async (req, res) => {
  try {
    const logs = await LogAppareil.findAll({
      include: [{ model: Etudiant }],
      order: [["timestamp", "DESC"]],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================================
// Rechercher les logs par device_user_id
// ========================================
exports.searchByDeviceUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const logs = await LogAppareil.findAll({
      where: { user_id },
      include: [{ model: Etudiant }],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================================
// Supprimer un log
// ========================================
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await LogAppareil.findByPk(id);
    if (!log) return res.status(404).json({ error: "Log non trouvé" });
    await log.destroy();
    res.json({ message: "Log supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
