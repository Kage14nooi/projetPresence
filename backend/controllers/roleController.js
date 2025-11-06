const { Role } = require("../models");

exports.createRole = async (req, res) => {
  const role = await Role.create(req.body);
  res.json(role);
};

exports.getRoles = async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
};
