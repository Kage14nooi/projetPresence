const { Notification, Etudiant } = require("../models");
const nodemailer = require("nodemailer");

// Configuration du transporteur email (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "randrianarijaonatsilavina14@gmail.com",
    pass: "rpxkkruagvbktdca",
  },
});

// 🔹 Envoi d'une notification individuelle (existant)
exports.createNotification = async (req, res) => {
  try {
    const { etudiant_id, objet, description } = req.body;

    const notif = await Notification.create({
      etudiant_id,
      objet,
      description,
    });

    const etudiant = await Etudiant.findByPk(etudiant_id);
    if (etudiant && etudiant.etudiant_mail) {
      await transporter.sendMail({
        from: '"Absence System" <randrianarijaonatsilavina14@gmail.com>',
        to: etudiant.etudiant_mail,
        subject: objet,
        text: description,
      });
    }

    res.json({ status: "ok", notif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Envoi de notifications aux étudiants sélectionnés dans la liste des absents
exports.sendNotificationsSelected = async (req, res) => {
  try {
    const { etudiants, objet, description } = req.body;
    // etudiants = [1,2,3,...] => liste des etudiant_id sélectionnés

    const batchSize = 10; // pour éviter surcharge
    const notificationsSent = [];

    for (let i = 0; i < etudiants.length; i += batchSize) {
      const batch = etudiants.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (etudiant_id) => {
          const etudiant = await Etudiant.findByPk(etudiant_id);
          if (!etudiant) return;

          // Créer la notification dans la DB
          const notif = await Notification.create({
            etudiant_id,
            objet,
            description,
          });

          // Envoyer l'email si l'étudiant a une adresse
          if (etudiant.etudiant_mail) {
            await transporter.sendMail({
              from: '"Absence System" <randrianarijaonatsilavina14@gmail.com>',
              to: etudiant.etudiant_mail,
              subject: objet,
              text: description,
            });
          }

          notificationsSent.push(notif);
        })
      );
    }

    res.json({
      status: "ok",
      message: "Notifications envoyées aux étudiants sélectionnés",
      count: notificationsSent.length,
      notifications: notificationsSent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Récupérer toutes les notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.findAll({
      include: [{ model: Etudiant }],
      order: [["date_envoi", "DESC"]],
    });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id, { include: Etudiant });
    if (!notif)
      return res.status(404).json({ error: "Notification non trouvée" });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif)
      return res.status(404).json({ error: "Notification non trouvée" });

    await notif.update(req.body);
    res.json({ message: "Notification mise à jour avec succès", notif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif)
      return res.status(404).json({ error: "Notification non trouvée" });

    await notif.destroy();
    res.json({ message: "Notification supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
