const { Notification, Etudiant } = require("../models");
const nodemailer = require("nodemailer");

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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "randrianarijaonatsilavina14@gmail.com",
          pass: "rpxkkruagvbktdca",
        },
      });
      await transporter.sendMail({
        from: '"Absence System" <ton.email@gmail.com>',
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

exports.getNotifications = async (req, res) => {
  const notifs = await Notification.findAll({ include: Etudiant });
  res.json(notifs);
};
