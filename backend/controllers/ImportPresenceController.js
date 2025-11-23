const fs = require("fs");
const csv = require("csv-parser");
const { Presence, Etudiant, Seance } = require("../models/index");

exports.importHikvisionCSV = async (req, res) => {
  try {
    const seanceId = req.params.id;
    console.log("=== Début import Hikvision CSV ===");
    console.log("Seance ID :", seanceId);

    // Vérification de la séance
    const seance = await Seance.findByPk(seanceId);
    if (!seance) {
      console.log("Séance non trouvée");
      return res.status(404).json({ error: "Séance non trouvée" });
    }

    if (!req.file) {
      console.log("Fichier manquant");
      return res.status(400).json({ error: "Fichier manquant" });
    }

    console.log("Fichier reçu :", req.file.path);

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv({ skipLines: 0 }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log("Nombre de lignes lues dans le CSV :", results.length);
        let imported = 0;
        let skipped = 0;

        for (const row of results) {
          console.log("----------");
          console.log("Ligne CSV brute :", row);

          // Nettoyage des champs
          const matricule = row["sJobNo"]?.replace(/'/g, "").trim();
          const date = row["Date"]?.replace(/'/g, "").trim();
          const time = row["Time"]?.replace(/'/g, "").trim();
          const direction =
            row["IN/OUT"]?.replace(/'/g, "").trim().toUpperCase() || "IN";

          console.log("Matricule traité :", matricule);
          console.log("Date :", date, "Time :", time, "Direction :", direction);

          if (!matricule || matricule === "NULL") {
            console.log("Matricule invalide, ligne ignorée");
            skipped++;
            continue;
          }

          const etudiant = await Etudiant.findOne({
            where: { etudiant_matricule: matricule },
          });

          if (!etudiant) {
            console.log("Étudiant non trouvé pour ce matricule :", matricule);
            skipped++;
            continue;
          }

          console.log(
            "Étudiant trouvé :",
            etudiant.etudiant_nom,
            etudiant.etudiant_prenom
          );

          let presence = await Presence.findOne({
            where: { etudiant_id: etudiant.etudiant_id, seance_id: seanceId },
          });

          if (!presence) {
            console.log("Création d'une nouvelle présence pour", matricule);
            presence = await Presence.create({
              etudiant_id: etudiant.etudiant_id,
              seance_id: seanceId,
              status: "A", // par défaut absent
            });
          } else {
            console.log("Présence existante trouvée pour", matricule);
          }

          // Création du timestamp
          let timestamp = null;
          if (date && time) {
            timestamp = `${date} ${time}`;
          } else if (date) {
            timestamp = date;
          }

          console.log("Timestamp à enregistrer :", timestamp);

          if (direction === "IN") {
            presence.heure_entree = timestamp;
            // Si heure_entree existe, le status devient présent
            presence.status = "P";
          } else if (direction === "OUT") {
            presence.heure_sortie = timestamp;
            // Si heure_sortie existe et absence, on peut aussi marquer présent
            if (!presence.heure_entree) presence.status = "P";
          }

          await presence.save();
          console.log("Présence enregistrée :", presence.toJSON());
          imported++;
        }

        console.log(
          `=== Import terminé : ${imported} lignes importées, ${skipped} lignes ignorées ===`
        );

        res.json({
          message: `Import terminé : ${imported} lignes importées, ${skipped} lignes ignorées.`,
        });
      });
  } catch (err) {
    console.error("❌ ERREUR importHikvisionCSV :", err);
    res.status(500).json({ error: err.message });
  }
};
