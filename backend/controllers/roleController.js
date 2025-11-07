const { Role } = require("../models");

// ➕ Créer un rôle
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Récupérer tous les rôles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer un rôle par ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Rôle non trouvé" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un rôle
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Rôle non trouvé" });

    await role.update(req.body);
    res.json({ message: "Rôle mis à jour avec succès", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer un rôle
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Rôle non trouvé" });

    await role.destroy();
    res.json({ message: "Rôle supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
