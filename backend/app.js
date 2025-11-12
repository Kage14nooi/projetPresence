const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const adminRoutes = require("./routes/adminRoutes");
const roleRoutes = require("./routes/roleRoutes");
const etudiantRoutes = require("./routes/etudiantRoutes");
const professeurRoutes = require("./routes/professeurRoutes");
const parcoursRoutes = require("./routes/parcoursRoutes");
const matiereRoutes = require("./routes/matiereRoutes");
const pieceRoutes = require("./routes/pieceRoutes");
const presenceRoutes = require("./routes/presenceRoutes");
const absenceRoutes = require("./routes/absenceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const logRoutes = require("./routes/logRoutes");
const sceancesRoutes = require("./routes/sceanceRoutes");

// Utilisation des routes
app.use("/api/admins", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/etudiants", etudiantRoutes);
app.use("/api/professeurs", professeurRoutes);
app.use("/api/parcours", parcoursRoutes);
app.use("/api/matieres", matiereRoutes);
app.use("/api/pieces", pieceRoutes);
app.use("/api/presences", presenceRoutes);
app.use("/api/absences", absenceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/sceances", sceancesRoutes);

module.exports = app;
