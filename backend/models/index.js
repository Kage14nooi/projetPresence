const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("gestion_presence", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Admin
const Admin = sequelize.define(
  "admin",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_nom: DataTypes.STRING,
    admin_prenom: DataTypes.STRING,
    admin_mdp: DataTypes.STRING,
  },
  { timestamps: false }
);

// Role
const Role = sequelize.define(
  "role",
  {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_type: DataTypes.STRING,
  },
  { timestamps: false }
);

// Étudiant
const Etudiant = sequelize.define(
  "etudiant",
  {
    etudiant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_nom: DataTypes.STRING,
    etudiant_prenom: DataTypes.STRING,
    etudiant_matricule: { type: DataTypes.STRING, unique: true },
    etudiant_niveau: DataTypes.STRING,
    etudiant_parcours: DataTypes.STRING,
    etudiant_mail: DataTypes.STRING,
    etudiant_tel: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
  },
  { timestamps: false }
);

// Professeur
const Professeur = sequelize.define(
  "professeur",
  {
    professeur_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professeur_nom: DataTypes.STRING,
    professeur_prenom: DataTypes.STRING,
    professeur_mail: DataTypes.STRING,
    professeur_tel: DataTypes.STRING,
  },
  { timestamps: false }
);

// Parcours
const Parcours = sequelize.define(
  "parcours",
  {
    parcours_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parcours_nom: DataTypes.STRING,
  },
  { timestamps: false }
);

// Matière
const Matiere = sequelize.define(
  "matiere",
  {
    matiere_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matiere_nom: DataTypes.STRING,
    matiere_heureDebut: DataTypes.TIME,
    matiere_heureFin: DataTypes.TIME,
    professeur_id: DataTypes.INTEGER,
    parcours_id: DataTypes.INTEGER,
  },
  { timestamps: false }
);

// Pièce justificative
const PieceJustificative = sequelize.define(
  "piece",
  {
    pieceJust_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pieceJust_description: DataTypes.STRING,
  },
  { timestamps: false }
);

// Présence
const Presence = sequelize.define(
  "presence",
  {
    presence_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_id: DataTypes.INTEGER,
    matiere_id: DataTypes.INTEGER,
    date_presence: DataTypes.DATEONLY,
    heure_entree: DataTypes.TIME,
    heure_sortie: DataTypes.TIME,
    status: DataTypes.ENUM("P", "A"),
  },
  { timestamps: false }
);

// Absence
const Absence = sequelize.define(
  "absence",
  {
    absence_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_id: DataTypes.INTEGER,
    matiere_id: DataTypes.INTEGER,
    date_absence: DataTypes.DATEONLY,
    motif: DataTypes.ENUM("Maladie", "Evénement familial", "Autres"),
    pieceJust_id: DataTypes.INTEGER,
    observation: DataTypes.TEXT,
  },
  { timestamps: false }
);

// Notification
const Notification = sequelize.define(
  "notification",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_id: DataTypes.INTEGER,
    objet: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_envoi: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  { timestamps: false }
);

// Log appareil
const LogAppareil = sequelize.define(
  "log",
  {
    log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    etudiant_id: DataTypes.INTEGER,
    matiere_id: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
  },
  { timestamps: false }
);

// Associations
Etudiant.belongsTo(Role, { foreignKey: "role_id" });
Matiere.belongsTo(Professeur, { foreignKey: "professeur_id" });
Matiere.belongsTo(Parcours, { foreignKey: "parcours_id" });
Presence.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
Presence.belongsTo(Matiere, { foreignKey: "matiere_id" });
Absence.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
Absence.belongsTo(Matiere, { foreignKey: "matiere_id" });
Absence.belongsTo(PieceJustificative, { foreignKey: "pieceJust_id" });
Notification.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
LogAppareil.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
LogAppareil.belongsTo(Matiere, { foreignKey: "matiere_id" });

module.exports = {
  sequelize,
  Admin,
  Role,
  Etudiant,
  Professeur,
  Parcours,
  Matiere,
  PieceJustificative,
  Presence,
  Absence,
  Notification,
  LogAppareil,
};
