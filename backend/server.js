// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app");
// require("./config/database"); // Connexion DB

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Middleware pour passer io à toutes les requêtes
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // SOCKET.IO
// io.on("connection", (socket) => {
//   console.log("Frontend connecté pour temps réel");
// });

// server.listen(3001, () =>
//   console.log("Backend Node.js démarré sur http://localhost:3001")
// );

// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app");
// require("./config/database");
// const cron = require("node-cron");
// const { Seance, Presence, Absence, Etudiant, Matiere } = require("./models");

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Middleware pour passer io
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // SOCKET.IO
// io.on("connection", () => {
//   console.log("Frontend connecté pour temps réel");
// });

// // ================== CRON toutes les minutes ==================
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     // 1️⃣ ACTIVATION automatique
//     const seancesInactives = await Seance.findAll({
//       where: { is_active: false },
//     });

//     for (const seance of seancesInactives) {
//       const [hD, mD] = seance.heure_debut.split(":").map(Number);
//       const dateDebut = new Date(seance.date_seance);
//       dateDebut.setHours(hD, mD, 0, 0);

//       if (now >= dateDebut) {
//         seance.is_active = true;
//         await seance.save();

//         // Créer les présences
//         const matiere = await Matiere.findByPk(seance.matiere_id);

//         if (matiere) {
//           const etudiants = await Etudiant.findAll({
//             where: {
//               parcours_id: matiere.parcours_id,
//               mention_id: matiere.mention_id,
//               niveau_id: matiere.niveau_id,
//             },
//           });

//           for (const etudiant of etudiants) {
//             await Presence.findOrCreate({
//               where: {
//                 etudiant_id: etudiant.etudiant_id,
//                 seance_id: seance.seance_id,
//               },
//               defaults: {
//                 status: "A",
//                 heure_entree: null,
//                 heure_sortie: null,
//               },
//             });
//           }
//         }

//         console.log(`Séance ${seance.seance_id} ACTIVÉE automatiquement`);

//         // 🔥 Notifier frontend
//         io.emit("seance_auto_update", {
//           seance_id: seance.seance_id,
//           is_active: true,
//         });
//       }
//     }

//     // 2️⃣ DÉSACTIVATION automatique
//     const seancesActives = await Seance.findAll({
//       where: { is_active: true },
//     });

//     for (const seance of seancesActives) {
//       const [hF, mF] = seance.heure_fin.split(":").map(Number);
//       const dateFin = new Date(seance.date_seance);
//       dateFin.setHours(hF, mF, 0, 0);

//       if (now >= dateFin) {
//         seance.is_active = false;
//         await seance.save();

//         // Enregistrer les absences
//         const presencesAbsentes = await Presence.findAll({
//           where: {
//             seance_id: seance.seance_id,
//             status: "A",
//           },
//         });

//         for (const p of presencesAbsentes) {
//           await Absence.findOrCreate({
//             where: {
//               etudiant_id: p.etudiant_id,
//               seance_id: seance.seance_id,
//             },
//             defaults: {
//               statut: "Absent",
//               justification_status: "En attente",
//             },
//           });
//         }

//         console.log(
//           `Séance ${seance.seance_id} TERMINÉE → désactivée + absences`
//         );

//         // 🔥 Notifier frontend
//         io.emit("seance_auto_update", {
//           seance_id: seance.seance_id,
//           is_active: false,
//         });
//       }
//     }
//   } catch (err) {
//     console.error("Erreur CRON :", err);
//   }
// });

// // Démarrage serveur
// server.listen(3001, () =>
//   console.log("Backend Node.js démarré sur http://localhost:3001")
// );

// server.js
// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app"); // ton Express app
// require("./config/database"); // Sequelize et connexion DB
// const cron = require("node-cron");
// const { Seance, Presence, Absence, Etudiant, Matiere } = require("./models");

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Middleware pour passer io dans les routes
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Socket.io : connexion
// io.on("connection", () => {
//   console.log("Frontend connecté pour temps réel");
// });

// // CRON toutes les minutes
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     // ================== ACTIVATION ==================
//     const seancesInactives = await Seance.findAll({
//       where: { is_active: false },
//     });

//     for (const seance of seancesInactives) {
//       const [hD, mD] = seance.heure_debut.split(":").map(Number);
//       const dateDebut = new Date(seance.date_seance);
//       dateDebut.setHours(hD, mD, 0, 0);

//       if (now >= dateDebut) {
//         seance.is_active = true;
//         await seance.save();

//         // Créer les présences
//         const matiere = await Matiere.findByPk(seance.matiere_id);
//         if (matiere) {
//           const etudiants = await Etudiant.findAll({
//             where: {
//               parcours_id: matiere.parcours_id,
//               mention_id: matiere.mention_id,
//               niveau_id: matiere.niveau_id,
//             },
//           });

//           for (const etudiant of etudiants) {
//             await Presence.findOrCreate({
//               where: {
//                 etudiant_id: etudiant.etudiant_id,
//                 seance_id: seance.seance_id,
//               },
//               defaults: { status: "A", heure_entree: null, heure_sortie: null },
//             });
//           }
//         }

//         console.log(`Séance ${seance.seance_id} ACTIVÉE automatiquement`);

//         // Notifier le frontend
//         io.emit("seance_auto_update", {
//           seance_id: seance.seance_id,
//           is_active: true,
//         });
//       }
//     }

//     // ================== DÉSACTIVATION ==================
//     const seancesActives = await Seance.findAll({ where: { is_active: true } });

//     for (const seance of seancesActives) {
//       const [hF, mF] = seance.heure_fin.split(":").map(Number);
//       const dateFin = new Date(seance.date_seance);
//       dateFin.setHours(hF, mF, 0, 0);

//       if (now >= dateFin) {
//         seance.is_active = false;
//         await seance.save();

//         // Enregistrer les absences
//         const presencesAbsentes = await Presence.findAll({
//           where: { seance_id: seance.seance_id, status: "A" },
//         });

//         for (const p of presencesAbsentes) {
//           await Absence.findOrCreate({
//             where: { etudiant_id: p.etudiant_id, seance_id: seance.seance_id },
//             defaults: { statut: "Absent", justification_status: "En attente" },
//           });
//         }

//         console.log(
//           `Séance ${seance.seance_id} TERMINÉE → désactivée + absences`
//         );

//         // Notifier le frontend
//         io.emit("seance_auto_update", {
//           seance_id: seance.seance_id,
//           is_active: false,
//         });
//       }
//     }
//   } catch (err) {
//     console.error("Erreur CRON :", err);
//   }
// });

// // Démarrage serveur
// server.listen(3001, () => {
//   console.log("Backend Node.js démarré sur http://localhost:3001");
// });

// server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // ton Express app
require("./config/database"); // Sequelize et connexion DB
const { Seance, Presence, Absence, Etudiant, Matiere } = require("./models");

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware pour passer io dans les routes si nécessaire
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io : connexion
io.on("connection", () => {
  console.log("Frontend connecté pour temps réel");
});

// Fonction pour mettre à jour le statut d'une séance
async function updateSeanceStatus(seance) {
  const now = new Date();
  const start = new Date(`${seance.date_seance} ${seance.heure_debut}`);
  const end = new Date(`${seance.date_seance} ${seance.heure_fin}`);

  let newStatus = seance.is_active;

  // Activer si début <= maintenant < fin
  if (now >= start && now <= end) newStatus = true;

  // Désactiver si terminé
  if (now > end) newStatus = false;

  // Si le status a changé, sauvegarder et émettre seulement cette séance
  if (newStatus !== seance.is_active) {
    seance.is_active = newStatus;
    await seance.save();

    // Si activation → créer présences
    if (newStatus) {
      const matiere = await Matiere.findByPk(seance.matiere_id);
      if (matiere) {
        const etudiants = await Etudiant.findAll({
          where: {
            parcours_id: matiere.parcours_id,
            mention_id: matiere.mention_id,
            niveau_id: matiere.niveau_id,
          },
        });
        for (const etudiant of etudiants) {
          await Presence.findOrCreate({
            where: {
              etudiant_id: etudiant.etudiant_id,
              seance_id: seance.seance_id,
            },
            defaults: { status: "A", heure_entree: null, heure_sortie: null },
          });
        }
      }
    }

    // Si désactivation → enregistrer absences
    if (!newStatus) {
      const presencesAbsentes = await Presence.findAll({
        where: { seance_id: seance.seance_id, status: "A" },
      });
      for (const p of presencesAbsentes) {
        await Absence.findOrCreate({
          where: { etudiant_id: p.etudiant_id, seance_id: seance.seance_id },
          defaults: { statut: "Absent", justification_status: "En attente" },
        });
      }
    }

    // Émettre uniquement pour cette séance
    io.emit("seance_auto_update", {
      seance_id: seance.seance_id,
      is_active: seance.is_active,
    });

    console.log(`Séance ${seance.seance_id} → is_active=${seance.is_active}`);
  }
}


      if (now >= dateDebut) {
        seance.is_active = true;
        await seance.save();

        // Créer les présences
        const matiere = await Matiere.findByPk(seance.matiere_id);
        if (matiere) {
          const etudiants = await Etudiant.findAll({
            where: {
              parcours_id: matiere.parcours_id,
              mention_id: matiere.mention_id,
              niveau_id: matiere.niveau_id,
            },
          });

          for (const etudiant of etudiants) {
            await Presence.findOrCreate({
              where: {
                etudiant_id: etudiant.etudiant_id,
                seance_id: seance.seance_id,
              },
              defaults: { status: "A", heure_entree: null, heure_sortie: null },
            });
          }
        }

        // console.log(`Séance ${seance.seance_id} ACTIVÉE automatiquement`);

        // Notifier le frontend
        io.emit("seance_auto_update", {
          seance_id: seance.seance_id,
          is_active: true,
        });
      }
    }

    // ================== DÉSACTIVATION ==================
    const seancesActives = await Seance.findAll({ where: { is_active: true } });

    for (const seance of seancesActives) {
      const [hF, mF] = seance.heure_fin.split(":").map(Number);
      const dateFin = new Date(seance.date_seance);
      dateFin.setHours(hF, mF, 0, 0);

      if (now >= dateFin) {
        seance.is_active = false;
        await seance.save();

        // Enregistrer les absences
        const presencesAbsentes = await Presence.findAll({
          where: { seance_id: seance.seance_id, status: "A" },
        });

        for (const p of presencesAbsentes) {
          await Absence.findOrCreate({
            where: { etudiant_id: p.etudiant_id, seance_id: seance.seance_id },
            defaults: { statut: "Absent", justification_status: "En attente" },
          });
        }

        // console.log(
        //   `Séance ${seance.seance_id} TERMINÉE → désactivée + absences`
        // );

        // Notifier le frontend
        io.emit("seance_auto_update", {
          seance_id: seance.seance_id,
          is_active: false,
        });
      }
// Vérification automatique toutes les minutes
setInterval(async () => {
  try {
    const seances = await Seance.findAll();
    for (const seance of seances) {
      await updateSeanceStatus(seance);

    }
  } catch (err) {
    console.error("Erreur lors de la vérification des séances :", err);
  }
}, 60000);

// Démarrage serveur
// server.listen(3001, "0.0.0.0", () => {
//   console.log("Backend Node.js démarré sur http://0.0.0.0:3001");
// });

const PORT = 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Node.js démarré sur http://192.168.1.10:${PORT}`);
});
