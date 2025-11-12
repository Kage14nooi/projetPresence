const { Admin } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// ➕ Créer un administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { admin_nom, admin_prenom, admin_email, admin_mdp } = req.body;

    if (!admin_nom || !admin_prenom || !admin_email || !admin_mdp)
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ where: { admin_email } });
    if (existingAdmin)
      return res.status(400).json({ message: "Cet email est déjà utilisé" });

    const hash = await bcrypt.hash(admin_mdp, 10);

    const admin = await Admin.create({
      admin_nom,
      admin_prenom,
      admin_email,
      admin_mdp: hash,
    });

    res.status(201).json({
      message: "Administrateur créé avec succès",
      admin: {
        id: admin.admin_id,
        nom: admin.admin_nom,
        prenom: admin.admin_prenom,
        email: admin.admin_email,
      },
    });
  } catch (err) {
    console.error("Erreur création admin :", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer tous les admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: [
        "admin_id",
        "admin_nom",
        "admin_prenom",
        "admin_email",
        "admin_mdp",
      ],
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un admin par ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ["admin_id", "admin_nom", "admin_prenom", "admin_email"],
    });
    if (!admin)
      return res.status(404).json({ message: "Administrateur non trouvé" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Administrateur non trouvé" });

    const { admin_nom, admin_prenom, admin_email, admin_mdp } = req.body;
    let updateData = { admin_nom, admin_prenom, admin_email };

    if (admin_mdp) {
      updateData.admin_mdp = await bcrypt.hash(admin_mdp, 10);
    }

    await admin.update(updateData);

    res.json({
      message: "Administrateur mis à jour avec succès",
      admin: {
        id: admin.admin_id,
        nom: admin.admin_nom,
        prenom: admin.admin_prenom,
        email: admin.admin_email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer un admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Administrateur non trouvé" });

    await admin.destroy();
    res.json({ message: "Administrateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Rechercher un admin (par nom, prénom ou email)
exports.searchAdmins = async (req, res) => {
  try {
    const { nom, prenom, email } = req.query;

    const admins = await Admin.findAll({
      where: {
        ...(nom ? { admin_nom: { [Op.like]: `%${nom}%` } } : {}),
        ...(prenom ? { admin_prenom: { [Op.like]: `%${prenom}%` } } : {}),
        ...(email ? { admin_email: { [Op.like]: `%${email}%` } } : {}),
      },
      attributes: ["admin_id", "admin_nom", "admin_prenom", "admin_email"],
    });

    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 Connexion admin (via email)
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { admin_email, admin_mdp } = req.body;
//     const admin = await Admin.findOne({ where: { admin_email } });

//     if (!admin)
//       return res.status(404).json({ message: "Administrateur non trouvé" });

//     const isValid = await bcrypt.compare(admin_mdp, admin.admin_mdp);
//     if (!isValid)
//       return res.status(401).json({ message: "Mot de passe incorrect" });

//     res.json({
//       message: "Connexion réussie",
//       admin: {
//         id: admin.admin_id,
//         nom: admin.admin_nom,
//         prenom: admin.admin_prenom,
//         email: admin.admin_email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_mdp } = req.body;

    const admin = await Admin.findOne({ where: { admin_email } });
    if (!admin)
      return res.status(404).json({ message: "Administrateur non trouvé" });

    const isValid = await bcrypt.compare(admin_mdp, admin.admin_mdp);
    if (!isValid)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    // Génération du token
    const token = jwt.sign(
      {
        id: admin.admin_id,
        email: admin.admin_email,
        nom: admin.admin_nom,
      },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      admin: {
        id: admin.admin_id,
        nom: admin.admin_nom,
        prenom: admin.admin_prenom,
        email: admin.admin_email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    // Il suffit de demander au client de supprimer le token (dans le localStorage ou cookie)
    res.json({
      message: "Déconnexion réussie. Veuillez supprimer le token côté client.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
