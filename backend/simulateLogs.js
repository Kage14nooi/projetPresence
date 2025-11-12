// simulateurLog.js
const axios = require("axios");

// ✅ Simulation pour 10 étudiants
// Ces user_id doivent correspondre à device_user_id dans votre table Etudiant
const etudiants = [
  "1001",
  "1002",
  "1003",
  "1004",
  "1005",
  "1006",
  "1007",
  "1008",
  "1009",
  "1010",
];

// Fonction pour simuler un log venant de l'appareil
const simulateLog = async () => {
  for (const user_id of etudiants) {
    const log = {
      device_id: "DSK1T804AMF1", // ID du terminal simulé
      user_id, // correspond à device_user_id dans DB
      event_type: "Fingerprint", // type d'événement
      direction: "IN", // IN ou OUT
      timestamp: new Date().toISOString(),
    };

    try {
      // Appel POST vers l'API log
      const res = await axios.post(
        "http://localhost:3001/api/logs", // Assurez-vous que c'est votre endpoint log
        log
      );
      console.log("Log simulé envoyé:", res.data);
    } catch (err) {
      console.error(
        "Erreur lors de l'envoi du log:",
        err.response ? err.response.data : err.message
      );
    }
  }
};

// Envoie tous les logs en une seule fois
simulateLog();

// Optionnel : envoyer tous les 5 secondes pour simuler plusieurs scans
// setInterval(simulateLog, 5000);
