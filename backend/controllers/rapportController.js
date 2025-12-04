// const Sequelize = require("sequelize");
// const {
//   Etudiant,
//   Absence,
//   Seance,
//   Matiere,
//   Presence,
//   Parcours,
//   Mentions,
//   Niveau,
// } = require("../models");

// exports.absenceParEtudiant = async (req, res) => {
//   try {
//     const etudiantId = req.params.id;

//     const absences = await Absence.findAll({
//       where: { etudiant_id: etudiantId, statut: "Absent" },
//       include: [
//         {
//           model: Seance,
//           include: [{ model: Matiere }],
//         },
//       ],
//     });

//     const total = absences.length;

//     res.json({ total_absences: total, details: absences });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.absenceParMatiere = async (req, res) => {
//   try {
//     const matiereId = req.params.id;

//     const absences = await Absence.findAll({
//       include: [
//         {
//           model: Seance,
//           where: { matiere_id: matiereId },
//         },
//       ],
//     });

//     // Calcul du volume horaire perdu
//     let heuresPerdues = 0;
//     absences.forEach((abs) => {
//       const debut = abs.seance.heure_debut;
//       const fin = abs.seance.heure_fin;

//       const diff =
//         (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
//         3600000;
//       heuresPerdues += diff;
//     });

//     res.json({
//       matiere_id: matiereId,
//       total_absences: absences.length,
//       heures_perdues: heuresPerdues,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.absencesParPeriode = async (req, res) => {
//   try {
//     const { debut, fin } = req.query;

//     const absences = await Absence.findAll({
//       include: [
//         {
//           model: Seance,
//           where: {
//             date_seance: { [Sequelize.Op.between]: [debut, fin] },
//           },
//         },
//       ],
//     });

//     res.json({ total_absences: absences.length, absences });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.absenceAnnuelle = async (req, res) => {
//   try {
//     const annee = req.query.annee;

//     const absences = await Absence.findAll({
//       include: [
//         {
//           model: Seance,
//           where: Sequelize.where(
//             Sequelize.fn("YEAR", Sequelize.col("date_seance")),
//             annee
//           ),
//         },
//       ],
//     });

//     res.json({ total_absences: absences.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Dashboard

// exports.top5Absents = async (req, res) => {
//   try {
//     const abs = await Absence.findAll({
//       attributes: ["etudiant_id", [Sequelize.fn("COUNT", "*"), "total"]],
//       where: { statut: "Absent" },
//       group: ["etudiant_id"],
//       order: [[Sequelize.literal("total"), "DESC"]],
//       limit: 5,
//       include: [{ model: Etudiant }],
//     });

//     res.json(abs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.presenceGlobale = async (req, res) => {
//   try {
//     const totalEtudiants = await Etudiant.count();
//     const totalSeances = await Seance.count();

//     const totalPossible = totalEtudiants * totalSeances;

//     const totalPres = await Presence.count({
//       where: { status: "P" },
//     });

//     const taux =
//       totalPossible > 0
//         ? ((totalPres / totalPossible) * 100).toFixed(2)
//         : "0.00";

//     res.json({ taux_presence: taux + "%" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.absencesParJour = async (req, res) => {
//   try {
//     const abs = await Absence.findAll({
//       include: [{ model: Seance }],
//     });

//     const result = {};

//     abs.forEach((a) => {
//       const jour = new Date(a.seance.date_seance).getDay(); // 0-6
//       result[jour] = (result[jour] || 0) + 1;
//     });

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.topRetards = async (req, res) => {
//   try {
//     const retard = await Absence.findAll({
//       where: { statut: "En retard" },
//       attributes: ["etudiant_id", [Sequelize.fn("COUNT", "*"), "total"]],
//       group: ["etudiant_id"],
//       include: [{ model: Etudiant }],
//       order: [[Sequelize.literal("total"), "DESC"]],
//       limit: 5,
//     });

//     res.json(retard);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // rapport par étudiant
// exports.rapportEtudiant = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const etudiant = await Etudiant.findByPk(id, {
//       include: [{ model: Parcours }, { model: Mentions }, { model: Niveau }],
//     });

//     const absences = await Absence.findAll({
//       where: { etudiant_id: id },
//       include: [{ model: Seance, include: [Matiere] }],
//     });

//     const presences = await Presence.findAll({
//       where: { etudiant_id: id },
//       include: [{ model: Seance, include: [Matiere] }],
//     });

//     const retard = absences.filter((a) => a.statut === "En retard").length;

//     res.json({
//       etudiant,
//       total_absences: absences.length,
//       total_presences: presences.length,
//       retards: retard,
//       details_absences: absences,
//       details_presences: presences,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Sequelize = require("sequelize");
const {
  Etudiant,
  Absence,
  Seance,
  Matiere,
  Presence,
  Parcours,
  Mentions,
  Niveau,
} = require("../models");
const { count, log } = require("console");

// ========================================
// STATISTIQUES AVANCÉES
// ========================================

/**
 * Volume horaire perdu par matière
 */
exports.volumeHoraireParMatiere = async (req, res) => {
  try {
    const matiereId = req.params.id;

    const absences = await Absence.findAll({
      where: { statut: "Absent" },
      include: [
        {
          model: Seance,
          include: [{ model: Matiere, as: "matiere" }],
          where: { matiere_id: matiereId },
        },
      ],
    });

    let heuresPerdues = 0;
    absences.forEach((abs) => {
      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;
      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      heuresPerdues += diff;
    });

    const matiere = absences.length > 0 ? absences[0].seance.matiere : null;

    res.json({
      matiere_id: matiereId,
      matiere_nom: matiere?.matiere_nom,
      total_absences: absences.length,
      volume_horaire_perdu: heuresPerdues.toFixed(2),
      unite: "heures",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Heures perdues par niveau et mention
 */
exports.heuresPerduesParNiveauMention = async (req, res) => {
  try {
    const absences = await Absence.findAll({
      where: { statut: "Absent" },
      include: [
        {
          model: Seance,
          include: [{ model: Matiere, as: "matiere" }],
        },
        {
          model: Etudiant,
          include: [
            { model: Niveau, as: "niveau", attributes: ["niveau_nom"] },
            { model: Mentions, as: "mention", attributes: ["mention_nom"] },
          ],
        },
      ],
    });

    const stats = {};

    absences.forEach((abs) => {
      const niveau = abs.etudiant?.niveau?.niveau_nom || "Non défini";
      const mention = abs.etudiant?.mention?.mention_nom || "Non défini";
      const key = `${niveau} - ${mention}`;

      if (!stats[key]) {
        stats[key] = {
          niveau,
          mention,
          total_absences: 0,
          heures_perdues: 0,
        };
      }

      stats[key].total_absences++;

      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;
      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      stats[key].heures_perdues += diff;
    });

    // Formater les heures
    Object.values(stats).forEach((stat) => {
      stat.heures_perdues = parseFloat(stat.heures_perdues.toFixed(2));
    });

    res.json(Object.values(stats));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Pourcentage d'absences par matière (pour camembert)
 */

exports.pourcentageAbsencesParMatiere = async (req, res) => {
  try {
    // On récupère toutes les absences avec séance -> matière
    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          include: [
            {
              model: Matiere,
              as: "matiere",
              attributes: ["matiere_id", "matiere_nom"],
            },
          ],
        },
      ],
    });

    const totalGlobalAbsences = absences.length;
    // console.log("Total global des absences :", totalGlobalAbsences);

    const result = {};

    for (const abs of absences) {
      const seance = abs.seance;

      if (!seance || !seance.matiere) continue;

      const matiereId = seance.matiere.matiere_id;
      const matiereNom = seance.matiere.matiere_nom;

      if (!result[matiereId]) {
        result[matiereId] = {
          matiere_id: matiereId,
          matiere_nom: matiereNom,
          total_absences: 0,
          heures_perdues: 0,
          pourcentage: 0,
        };
      }

      // Calcul durée séance
      const debut = new Date(`2000-01-01 ${seance.heure_debut}`);
      const fin = new Date(`2000-01-01 ${seance.heure_fin}`);
      const diff = (fin - debut) / 3600000; // durée en heures

      result[matiereId].total_absences++;
      result[matiereId].heures_perdues += diff;
    }

    // Calcul des pourcentages
    for (const matiereId in result) {
      const absMatiere = result[matiereId].total_absences;
      result[matiereId].pourcentage = (
        (absMatiere / totalGlobalAbsences) *
        100
      ).toFixed(2);
    }

    res.json(Object.values(result));
  } catch (err) {
    console.error("Erreur Absences Globales :", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.pourcentageAbsencesParMatiere = async (req, res) => {
//   try {
//     // On récupère toutes les absences + séance + matière
//     const absences = await Absence.findAll({
//       include: [
//         {
//           model: Seance,
//           include: [
//             {
//               model: Matiere,
//               as: "matiere",
//               attributes: ["matiere_id", "matiere_nom"],
//             },
//           ],
//         },
//       ],
//     });

//     const count = absences.length;
//     console.log("Absence", count);
//     // Structure de regroupement
//     const result = {};
//     absences.forEach((abs) => {
//       const seance = abs.seance;
//       const matiereId = seance.matiere_id;
//       const matiereName = seance.matiere?.matiere_nom;

//       if (!result[matiereId]) {
//         result[matiereId] = {
//           matiere_id: matiereId,
//           matiere_nom: matiereName,
//           total_absences: 0,
//           heures_perdues: 0,
//         };
//       }

//       // Calcul durée séance
//       const debut = new Date(`2000-01-01 ${seance.heure_debut}`);
//       const fin = new Date(`2000-01-01 ${seance.heure_fin}`);
//       const diff = (fin - debut) / 3600000;

//       result[matiereId].total_absences += 1;
//       result[matiereId].heures_perdues += diff;
//     });
//     res.json(Object.values(result));
//   } catch (err) {
//     console.error("Erreur Absences Globales :", err);
//     res.status(500).json({ error: err.message });
//   }
// };

/**
 * Statistiques pour une période donnée
 */
exports.statistiquesPeriode = async (req, res) => {
  try {
    const { debut, fin } = req.query;

    if (!debut || !fin) {
      return res
        .status(400)
        .json({ error: "Les dates de début et fin sont requises" });
    }

    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          where: {
            date_seance: { [Sequelize.Op.between]: [debut, fin] },
          },
          include: [{ model: Matiere, as: "matiere" }],
        },
        {
          model: Etudiant,
        },
      ],
    });

    const presences = await Presence.findAll({
      include: [
        {
          model: Seance,
          where: {
            date_seance: { [Sequelize.Op.between]: [debut, fin] },
          },
        },
      ],
    });

    const absencesCompletes = absences.filter((a) => a.statut === "Absent");
    const retards = absences.filter((a) => a.statut === "En retard");

    let heuresPerdues = 0;
    absencesCompletes.forEach((abs) => {
      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;
      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      heuresPerdues += diff;
    });

    res.json({
      periode: { debut, fin },
      resume: {
        total_absences: absencesCompletes.length,
        total_retards: retards.length,
        total_presences: presences.length,
        heures_perdues: heuresPerdues.toFixed(2),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Statistiques annuelles pour l'année universitaire
 */
exports.statistiquesAnnuelles = async (req, res) => {
  try {
    const annee = req.query.annee;

    // if (!annee) {
    //   return res.status(400).json({ error: "L'année est requise" });
    // }

    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          where: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("date_seance")),
            annee
          ),
          include: [{ model: Matiere, as: "matiere" }],
        },
      ],
    });

    const presences = await Presence.findAll({
      include: [
        {
          model: Seance,
          where: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("date_seance")),
            annee
          ),
        },
      ],
    });

    const absencesCompletes = absences.filter((a) => a.statut === "Absent");
    const retards = absences.filter((a) => a.statut === "En retard");

    let heuresPerdues = 0;
    absencesCompletes.forEach((abs) => {
      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;
      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      heuresPerdues += diff;
    });

    res.json({
      annee_universitaire: annee,
      resume: {
        total_absences: absencesCompletes.length,
        total_retards: retards.length,
        total_presences: presences.length,
        heures_perdues: heuresPerdues.toFixed(2),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Liste des étudiants avec alerte (dépassement seuil)
 */

exports.etudiantsAvecAlerte = async (req, res) => {
  try {
    const seuil = parseFloat(req.query.seuil) || 25; // 25% par défaut

    // console.log("Chargement des étudiants...");

    const etudiants = await Etudiant.findAll({
      include: [
        {
          model: Parcours,
          as: "parcour",
          attributes: ["parcours_id", "parcours_nom"],
          required: false,
        },
        {
          model: Mentions,
          as: "mention",
          attributes: ["mention_id", "mention_nom"],
          required: false,
        },
        {
          model: Niveau,
          as: "niveau",
          attributes: ["niveau_id", "niveau_nom"],
          required: false,
        },
      ],
    });

    const etudiantsAvecAlerte = [];

    for (const etudiant of etudiants) {
      const id = etudiant.etudiant_id;

      // Comptage des absences
      const absences = await Absence.count({
        where: {
          etudiant_id: id,
          statut: "Absent",
        },
      });

      // Comptage des présences
      const presences = await Presence.count({
        where: { etudiant_id: id, status: "P" },
      });

      const total = absences + presences;
      const tauxAbsence = total > 0 ? (absences / total) * 100 : 0;

      if (tauxAbsence >= seuil) {
        etudiantsAvecAlerte.push({
          etudiant: {
            id: id,
            nom: etudiant.etudiant_nom,
            prenom: etudiant.etudiant_prenom,
            matricule: etudiant.etudiant_matricule,
            email: etudiant.etudiant_mail,

            niveau: etudiant.niveau?.niveau_nom || "Non défini",
            mention: etudiant.mention?.mention_nom || "Non défini",
            parcours: etudiant.parcour?.parcours_nom || "Non défini",
          },

          statistiques: {
            total_absences: absences,
            total_presences: presences,
            taux_absence: tauxAbsence.toFixed(2),
          },

          alerte: {
            niveau:
              tauxAbsence >= 50
                ? "CRITIQUE"
                : tauxAbsence >= 35
                ? "ÉLEVÉ"
                : "MOYEN",
            message: `Taux d'absence : ${tauxAbsence.toFixed(2)}%`,
          },
        });
      }
    }

    // Tri par taux d'absence décroissant
    etudiantsAvecAlerte.sort(
      (a, b) =>
        parseFloat(b.statistiques.taux_absence) -
        parseFloat(a.statistiques.taux_absence)
    );

    res.json({
      seuil,
      total_etudiants_alerte: etudiantsAvecAlerte.length,
      etudiants: etudiantsAvecAlerte,
    });
  } catch (err) {
    console.error("Erreur dans etudiantsAvecAlerte :", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Rapport complet d'un étudiant (pour export PDF)
 */
exports.rapportCompletEtudiant = async (req, res) => {
  try {
    const id = req.params.id;

    const etudiant = await Etudiant.findByPk(id, {
      include: [
        { model: Parcours, as: "parcour", attributes: ["parcours_nom"] },
        { model: Mentions, as: "mention", attributes: ["mention_nom"] },
        { model: Niveau, as: "niveau", attributes: ["niveau_nom"] },
      ],
    });

    if (!etudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    const absencesCompletes = await Absence.findAll({
      where: { etudiant_id: id, statut: "Absent" },
      include: [
        { model: Seance, include: [{ model: Matiere, as: "matiere" }] },
      ],
      order: [[Seance, "date_seance", "DESC"]],
    });

    const retards = await Absence.findAll({
      where: { etudiant_id: id, statut: "En retard" },
      include: [
        { model: Seance, include: [{ model: Matiere, as: "matiere" }] },
      ],
      order: [[Seance, "date_seance", "DESC"]],
    });

    const presences = await Presence.findAll({
      where: { etudiant_id: id, status: "P" },
      include: [
        { model: Seance, include: [{ model: Matiere, as: "matiere" }] },
      ],
      order: [[Seance, "date_seance", "DESC"]],
    });

    // Calculer heures perdues
    let heuresPerdues = 0;
    absencesCompletes.forEach((abs) => {
      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;
      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      heuresPerdues += diff;
    });

    // Statistiques par matière
    const statsParMatiere = {};

    [...absencesCompletes, ...retards, ...presences].forEach((record) => {
      const matiereId = record.seance.matiere_id;
      const matiereName = record.seance.matiere?.matiere_nom;

      if (!statsParMatiere[matiereId]) {
        statsParMatiere[matiereId] = {
          matiere_nom: matiereName,
          absences: 0,
          retards: 0,
          presences: 0,
        };
      }

      if (record.statut === "Absent") {
        statsParMatiere[matiereId].absences++;
      } else if (record.statut === "En retard") {
        statsParMatiere[matiereId].retards++;
      } else if (record.status === "P") {
        statsParMatiere[matiereId].presences++;
      }
    });

    // Calculer pourcentages
    Object.values(statsParMatiere).forEach((stat) => {
      const total = stat.absences + stat.retards + stat.presences;
      stat.pourcentage_absence =
        total > 0 ? ((stat.absences / total) * 100).toFixed(2) : "0.00";
      stat.pourcentage_presence =
        total > 0 ? ((stat.presences / total) * 100).toFixed(2) : "0.00";
    });

    // Score de régularité
    const totalSeances =
      absencesCompletes.length + retards.length + presences.length;
    const scoreRegularite =
      totalSeances > 0
        ? (
            (presences.length / totalSeances) * 100 -
            (retards.length / totalSeances) * 5
          ).toFixed(2)
        : "100.00";

    res.json({
      etudiant: etudiant.toJSON(),
      resume: {
        total_absences_completes: absencesCompletes.length,
        total_retards: retards.length,
        total_presences: presences.length,
        heures_perdues: heuresPerdues.toFixed(2),
        score_regularite: scoreRegularite,
      },
      statistiques_par_matiere: Object.values(statsParMatiere),
      details_absences: absencesCompletes.map((a) => ({
        date: a.seance.date_seance,
        matiere: a.seance.matiere?.matiere_nom,
        heure_debut: a.seance.heure_debut,
        heure_fin: a.seance.heure_fin,
        type: "Absence",
      })),
      details_retards: retards.map((r) => ({
        date: r.seance.date_seance,
        matiere: r.seance.matiere.nom,
        heure_debut: r.seance.heure_debut,
        heure_fin: r.seance.heure_fin,
        type: "Retard",
      })),
      date_generation: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.absenceParEtudiant = async (req, res) => {
  try {
    const etudiantId = req.params.id;

    const absences = await Absence.findAll({
      where: { etudiant_id: etudiantId, statut: "Absent" },
      include: [
        {
          model: Seance,
          include: [{ model: Matiere, as: "matiere" }],
        },
      ],
    });

    const total = absences.length;

    res.json({ total_absences: total, details: absences });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.absenceParMatiere = async (req, res) => {
  try {
    const matiereId = req.params.id;

    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          include: { model: Matiere, as: "matiere" },
          where: { matiere_id: matiereId },
        },
      ],
    });

    // Calcul du volume horaire perdu
    let heuresPerdues = 0;
    absences.forEach((abs) => {
      const debut = abs.seance.heure_debut;
      const fin = abs.seance.heure_fin;

      const diff =
        (new Date(`2000-01-01 ${fin}`) - new Date(`2000-01-01 ${debut}`)) /
        3600000;
      heuresPerdues += diff;
    });

    res.json({
      matiere_id: matiereId,
      total_absences: absences.length,
      heures_perdues: heuresPerdues,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.absencesParPeriode = async (req, res) => {
  try {
    const { debut, fin } = req.query;

    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          where: {
            date_seance: { [Sequelize.Op.between]: [debut, fin] },
          },
        },
      ],
    });

    res.json({ total_absences: absences.length, absences });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.absenceAnnuelle = async (req, res) => {
  try {
    const annee = req.query.annee;

    const absences = await Absence.findAll({
      include: [
        {
          model: Seance,
          where: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("date_seance")),
            annee
          ),
        },
      ],
    });

    res.json({ total_absences: absences.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dashboard

exports.top5Absents = async (req, res) => {
  try {
    const abs = await Absence.findAll({
      attributes: ["etudiant_id", [Sequelize.fn("COUNT", "*"), "total"]],
      where: { statut: "Absent" },
      group: ["etudiant_id"],
      order: [[Sequelize.literal("total"), "DESC"]],
      limit: 5,
      include: [{ model: Etudiant }],
    });

    res.json(abs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.presenceGlobale = async (req, res) => {
  try {
    const totalEtudiants = await Etudiant.count();
    const totalSeances = await Seance.count();

    const totalPossible = totalEtudiants * totalSeances;

    const totalPres = await Presence.count({
      where: { status: "P" },
    });

    const taux =
      totalPossible > 0
        ? ((totalPres / totalPossible) * 100).toFixed(2)
        : "0.00";

    res.json({ taux_presence: taux + "%" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.absencesParJour = async (req, res) => {
  try {
    const abs = await Absence.findAll({
      include: [{ model: Seance }],
    });

    const result = {};

    abs.forEach((a) => {
      const jour = new Date(a.seance.date_seance).getDay(); // 0-6
      result[jour] = (result[jour] || 0) + 1;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.topRetards = async (req, res) => {
  try {
    const retard = await Absence.findAll({
      where: { statut: "En retard" },
      attributes: ["etudiant_id", [Sequelize.fn("COUNT", "*"), "total"]],
      group: ["etudiant_id"],
      include: [{ model: Etudiant }],
      order: [[Sequelize.literal("total"), "DESC"]],
      limit: 5,
    });

    res.json(retard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// rapport par étudiant
exports.rapportEtudiant = async (req, res) => {
  try {
    const id = req.params.id;

    const etudiant = await Etudiant.findByPk(id, {
      include: [{ model: Parcours }, { model: Mentions }, { model: Niveau }],
    });

    const absences = await Absence.findAll({
      where: { etudiant_id: id },
      include: [{ model: Seance, include: [Matiere] }],
    });

    const presences = await Presence.findAll({
      where: { etudiant_id: id },
      include: [{ model: Seance, include: [Matiere] }],
    });

    const retard = absences.filter((a) => a.statut === "En retard").length;

    res.json({
      etudiant,
      total_absences: absences.length,
      total_presences: presences.length,
      retards: retard,
      details_absences: absences,
      details_presences: presences,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
