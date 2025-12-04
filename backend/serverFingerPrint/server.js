// serial-listener.js
// ⚠️ Compatible SerialPort v10+
// Commande installation :  npm install serialport

import { SerialPort, ReadlineParser } from "serialport";
import axios from "axios";

// -----------------------------
// 🔵 OUVERTURE DU PORT SÉRIE
// -----------------------------
const port = new SerialPort({
  path: "COM4", // Exemple Windows → COM3 / COM4
  baudRate: 9600, // Même vitesse que ton Arduino
});

// -----------------------------
// 🔵 PARSEUR POUR LIRE LIGNE PAR LIGNE
// -----------------------------
// On lit chaque ligne envoyée par Serial.println()
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let buffer = "";

// -----------------------------
// 🔵 ÉVÉNEMENT : NOUVELLE LIGNE REÇUE
// -----------------------------
parser.on("data", (line) => {
  line = line.trim();
  console.log("📥 Reçu Arduino :", line);

  buffer += line;

  // L'Arduino envoie un marqueur de fin
  if (line.includes("===FIN_ENVOI===")) {
    // On essaye d'extraire l'objet JSON
    const jsonStart = buffer.indexOf("{");
    const jsonEnd = buffer.lastIndexOf("}") + 1;

    const jsonString = buffer.slice(jsonStart, jsonEnd);

    buffer = ""; // reset pour le prochain cycle

    try {
      const payload = JSON.parse(jsonString);
      console.log("📤 Envoi à l'API :", payload);

      // Envoi au backend NodeJS
      axios
        .post("http://localhost:3001/api/logs", payload)
        .then(() => console.log("✅ Données envoyées avec succès"))
        .catch((err) => console.error("❌ Erreur API :", err.message));
    } catch (err) {
      console.log("❌ Erreur parsing JSON :", err.message);
    }
  }
});

// -----------------------------
// 🔵 ERREUR DU PORT SÉRIE
// -----------------------------
port.on("error", (err) => {
  console.error("❌ Erreur port série :", err.message);
});
