const { sequelize } = require("../models");

sequelize
  .authenticate()
  .then(() => console.log("Connexion MySQL réussie"))
  .catch((err) => console.error("Erreur connexion MySQL:", err));

sequelize.sync();

module.exports = sequelize;
