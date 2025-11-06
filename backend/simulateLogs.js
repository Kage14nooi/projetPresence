const axios = require("axios");

const simulateLog = async () => {
  const log = {
    etudiant_id: 1,
    matiere_id: 101,
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
};

// Envoie un log toutes les 5 secondes
setInterval(simulateLog, 5000);
