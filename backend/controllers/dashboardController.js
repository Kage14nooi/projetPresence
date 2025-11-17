const {
  Etudiant,
  Presence,
  Absence,
  Seance,
  Matiere,
  Professeur,
} = require("../models");

// GET /api/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    // Total étudiants
    const totalStudents = await Etudiant.count();

    // Présents aujourd'hui
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const presencesToday = await Presence.count({
      include: [
        {
          model: Seance,
          where: { date_seance: today },
        },
      ],
      where: { status: "P" },
    });

    // Absents aujourd'hui
    const absentsToday = await Presence.count({
      include: [
        {
          model: Seance,
          where: { date_seance: today },
        },
      ],
      where: { status: "A" },
    });

    const attendanceRate =
      totalStudents > 0
        ? ((presencesToday / totalStudents) * 100).toFixed(1)
        : 0;

    // Activités récentes (derniers 5 présences/absences)
    const recentActivitiesRaw = await Presence.findAll({
      order: [["presence_id", "DESC"]],
      limit: 5,
      include: [
        { model: Etudiant, attributes: ["etudiant_nom", "etudiant_prenom"] },
        {
          model: Seance,
          include: [
            {
              model: Matiere,
              include: [{ model: Professeur, attributes: ["professeur_nom"] }],
            },
          ],
        },
      ],
    });

    const recentActivities = recentActivitiesRaw.map((p) => ({
      id: p.presence_id,
      student: `${p.etudiant.etudiant_nom} ${p.etudiant.etudiant_prenom}`,
      action: p.status === "P" ? "Présence enregistrée" : "Absence enregistrée",
      subject: p.seance.matiere.matiere_nom,
      time: p.heure_entree ?? p.heure_sortie ?? "-",
      status: p.status === "P" ? "present" : "absent",
    }));

    // Alertes (ex: absences > 3 non justifiées)
    const absencesAlert = await Absence.findAll({
      where: { statut: "Absent", justification_status: "En attente" },
      limit: 5,
      include: [
        { model: Etudiant, attributes: ["etudiant_nom", "etudiant_prenom"] },
      ],
    });

    const alerts = absencesAlert.map((a) => ({
      id: a.absence_id,
      type: "warning",
      message: `${a.etudiant.etudiant_nom} ${a.etudiant.etudiant_prenom} a une absence non justifiée`,
      time: a.seance_id, // ou ajouter date si tu veux
    }));

    res.json({
      stats: {
        totalStudents,
        presencesToday,
        absentsToday,
        attendanceRate,
      },
      recentActivities,
      alerts,
    });
  } catch (err) {
    console.error("Erreur dashboard:", err);
    res.status(500).json({ error: err.message });
  }
};
