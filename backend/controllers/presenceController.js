const { Presence, Etudiant, LogAppareil } = require("../models");
const io = require("../server");

exports.uploadPresence = async (req, res) => {
  try {
    const { etudiant_id, matiere_id, timestamp, status } = req.body;
    const etudiant = await Etudiant.findByPk(etudiant_id);
    if (!etudiant) return res.status(400).json({ error: "Etudiant inconnu" });

    const presence = await Presence.create({
      etudiant_id,
      matiere_id,
      date_presence: timestamp.split("T")[0],
      heure_entree: timestamp.split("T")[1],
      status,
    });
    await LogAppareil.create({ etudiant_id, matiere_id, timestamp });
    io.emit("new_presence", { etudiant, presence });
    res.json({ status: "ok", presence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPresences = async (req, res) => {
  const presences = await Presence.findAll({ include: Etudiant });
  res.json(presences);
};
