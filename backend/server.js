// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const http = require("http");
// const nodemailer = require("nodemailer");

// const {
//   sequelize,
//   Admin,
//   Role,
//   Etudiant,
//   Professeur,
//   Parcours,
//   Matiere,
//   PieceJustificative,
//   Presence,
//   Absence,
//   Notification,
//   LogAppareil,
// } = require("./models/models");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(bodyParser.json());

// // Connexion MySQL
// sequelize
//   .authenticate()
//   .then(() => console.log("Connexion MySQL réussie"))
//   .catch((err) => console.error("Erreur connexion MySQL:", err));

// sequelize.sync();

// // ---------------- ENDPOINTS ----------------

// // Admin
// app.post("/api/admins", async (req, res) => {
//   try {
//     const admin = await Admin.create(req.body);
//     res.json(admin);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get("/api/admins", async (req, res) => {
//   const admins = await Admin.findAll();
//   res.json(admins);
// });

// // Role
// app.post("/api/roles", async (req, res) => {
//   const role = await Role.create(req.body);
//   res.json(role);
// });
// app.get("/api/roles", async (req, res) => {
//   const roles = await Role.findAll();
//   res.json(roles);
// });

// // Étudiant
// app.post("/api/etudiants", async (req, res) => {
//   const etudiant = await Etudiant.create(req.body);
//   res.json(etudiant);
// });
// app.get("/api/etudiants", async (req, res) => {
//   const etudiants = await Etudiant.findAll({ include: Role });
//   res.json(etudiants);
// });

// // Professeur
// app.post("/api/professeurs", async (req, res) => {
//   const prof = await Professeur.create(req.body);
//   res.json(prof);
// });
// app.get("/api/professeurs", async (req, res) => {
//   const profs = await Professeur.findAll();
//   res.json(profs);
// });

// // Parcours
// app.post("/api/parcours", async (req, res) => {
//   const parcours = await Parcours.create(req.body);
//   res.json(parcours);
// });
// app.get("/api/parcours", async (req, res) => {
//   const parcours = await Parcours.findAll();
//   res.json(parcours);
// });

// // Matiere
// app.post("/api/matieres", async (req, res) => {
//   const matiere = await Matiere.create(req.body);
//   res.json(matiere);
// });
// app.get("/api/matieres", async (req, res) => {
//   const matieres = await Matiere.findAll({ include: [Professeur, Parcours] });
//   res.json(matieres);
// });

// // Piece justificative
// app.post("/api/pieces", async (req, res) => {
//   const piece = await PieceJustificative.create(req.body);
//   res.json(piece);
// });
// app.get("/api/pieces", async (req, res) => {
//   const pieces = await PieceJustificative.findAll();
//   res.json(pieces);
// });

// // Présence (upload logs)
// app.post("/api/presences/upload", async (req, res) => {
//   try {
//     const { etudiant_id, matiere_id, timestamp, status } = req.body;
//     const etudiant = await Etudiant.findByPk(etudiant_id);
//     if (!etudiant) return res.status(400).json({ error: "Etudiant inconnu" });

//     const presence = await Presence.create({
//       etudiant_id,
//       matiere_id,
//       date_presence: timestamp.split("T")[0],
//       heure_entree: timestamp.split("T")[1],
//       status,
//     });
//     await LogAppareil.create({ etudiant_id, matiere_id, timestamp });
//     io.emit("new_presence", { etudiant, presence });
//     res.json({ status: "ok", presence });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get("/api/presences", async (req, res) => {
//   const presences = await Presence.findAll({ include: Etudiant });
//   res.json(presences);
// });

// // Absence
// app.post("/api/absences", async (req, res) => {
//   const absence = await Absence.create(req.body);
//   res.json(absence);
// });
// app.get("/api/absences", async (req, res) => {
//   const absences = await Absence.findAll({
//     include: [Etudiant, PieceJustificative],
//   });
//   res.json(absences);
// });

// // Notification
// app.post("/api/notifications", async (req, res) => {
//   try {
//     const { etudiant_id, objet, description } = req.body;
//     const notif = await Notification.create({
//       etudiant_id,
//       objet,
//       description,
//     });

//     const etudiant = await Etudiant.findByPk(etudiant_id);
//     if (etudiant && etudiant.etudiant_mail) {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "randrianarijaonatsilavina14@gmail.com",
//           pass: "rpxkkruagvbktdca",
//         },
//       });
//       await transporter.sendMail({
//         from: '"Absence System" <ton.email@gmail.com>',
//         to: etudiant.etudiant_mail,
//         subject: objet,
//         text: description,
//       });
//     }
//     res.json({ status: "ok", notif });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get("/api/notifications", async (req, res) => {
//   const notifs = await Notification.findAll({ include: Etudiant });
//   res.json(notifs);
// });

// // Logs appareil
// app.get("/api/logs", async (req, res) => {
//   const logs = await LogAppareil.findAll({ include: Etudiant });
//   res.json(logs);
// });

// // ---------------- SOCKET.IO ----------------
// io.on("connection", (socket) => {
//   console.log("Frontend connecté pour temps réel");
// });

// // ---------------- START SERVER ----------------
// server.listen(3001, () =>
//   console.log("Backend Node.js démarré sur http://localhost:3001")
// );
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
require("./config/database"); // Connexion DB

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware pour passer io à toutes les requêtes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("Frontend connecté pour temps réel");
});

server.listen(3001, () =>
  console.log("Backend Node.js démarré sur http://localhost:3001")
);
