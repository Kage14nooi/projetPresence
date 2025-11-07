///test simulation pour le log qui vient de l'appareil
const axios = require("axios");

const etudiants = [1]; // simulate Alice et Carol présents
const matiere_id = 1;
const dateNow = new Date().toISOString();

const simulateLog = async () => {
  for (const etudiant_id of etudiants) {
    const log = {
      etudiant_id,
      matiere_id,
      timestamp: new Date().toISOString(),
      status: "P",
    };

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presences/upload",
        log
      );
      console.log("Log envoyé:", res.data);
    } catch (err) {
      console.error(err.message);
    }
  }
};

// Envoie tous les 5 secondes (ou une seule fois pour tester)
simulateLog();
