const { Admin } = require("../models");

exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  const admins = await Admin.findAll();
  res.json(admins);
};
