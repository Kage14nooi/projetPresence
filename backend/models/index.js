const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("gestion_presence", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// =========================
// Admin
// =========================
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
    admin_email: DataTypes.STRING,
    admin_mdp: DataTypes.STRING,
  },
  { timestamps: false }
);

// =========================
// Role
// =========================
const Role = sequelize.define(
  "role",
  {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_type: DataTypes.STRING,
  },
  { timestamps: false }
);

// =========================
// Parcours
// =========================
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
// =========================
// Niveau
// =========================
const Niveau = sequelize.define(
  "niveau",
  {
    niveau_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    niveau_nom: DataTypes.STRING,
  },
  { timestamps: false }
);

// =========================
// Mentions
// =========================
const Mentions = sequelize.define(
  "mentions",
  {
    mention_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mention_nom: DataTypes.STRING,
  },
  { timestamps: false }
);

// =========================
// Étudiant
// =========================
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
    etudiant_mail: DataTypes.STRING,
    etudiant_tel: DataTypes.STRING,
    parcours_id: DataTypes.INTEGER,
    mention_id: DataTypes.INTEGER,
    niveau_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    device_user_id: DataTypes.STRING, // ID utilisé dans l'appareil biométrique
  },
  { timestamps: false }
);

// =========================
// Professeur
// =========================
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

// =========================
// Matière
// =========================
const Matiere = sequelize.define(
  "matiere",
  {
    matiere_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matiere_nom: DataTypes.STRING,
    professeur_id: DataTypes.INTEGER,
    parcours_id: DataTypes.INTEGER,
    mention_id: DataTypes.INTEGER,
    niveau_id: DataTypes.INTEGER,
  },
  { timestamps: false }
);

// =========================
// Séance
// =========================
const Seance = sequelize.define(
  "seance",
  {
    seance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matiere_id: DataTypes.INTEGER,
    date_seance: DataTypes.DATEONLY,
    heure_debut: DataTypes.TIME,
    heure_fin: DataTypes.TIME,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: false }, // activable/désactivable
  },
  { timestamps: false }
);

// =========================
// Présence
// =========================
const Presence = sequelize.define(
  "presence",
  {
    presence_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_id: DataTypes.INTEGER,
    seance_id: DataTypes.INTEGER,
    heure_entree: DataTypes.TIME,
    heure_sortie: DataTypes.TIME,
    status: { type: DataTypes.ENUM("P", "A"), defaultValue: "A" },
  },
  { timestamps: false }
);

// =========================
// Pièce justificative
// =========================
const PieceJustificative = sequelize.define(
  "piece",
  {
    pieceJust_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    absence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motif: {
      type: DataTypes.ENUM("Maladie", "Evénement familial", "Autres"),
      allowNull: false,
    },
    pieceJust_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pieceJust_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

// =========================
// Absence
// =========================
const Absence = sequelize.define(
  "absence",
  {
    absence_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etudiant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statut: {
      type: DataTypes.ENUM("Absent", "Présent", "En retard"),
      defaultValue: "Absent",
    },
    justification_status: {
      type: DataTypes.ENUM("En attente", "Validée", "Refusée"),
      defaultValue: "En attente",
    },
  },
  { timestamps: false }
);

// =========================
// Notification
// =========================
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

// =========================
// Log appareil
// =========================
const LogAppareil = sequelize.define(
  "log_appareil",
  {
    log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    device_id: DataTypes.STRING,
    user_id: DataTypes.STRING, // ID reçu de l'appareil
    etudiant_id: DataTypes.INTEGER,
    seance_id: DataTypes.INTEGER,
    matiere_id: DataTypes.INTEGER,
    event_type: DataTypes.STRING, // "Fingerprint", "Face", etc.
    direction: DataTypes.STRING, // "IN" ou "OUT"
    timestamp: DataTypes.DATE,
    raw_data: DataTypes.JSON, // données brutes de l'appareil
  },
  { timestamps: false }
);

// =========================
// Associations
// =========================
Etudiant.belongsTo(Role, { foreignKey: "role_id" });
Etudiant.belongsTo(Parcours, { foreignKey: "parcours_id" });
Etudiant.belongsTo(Mentions, { foreignKey: "mention_id" });
Etudiant.belongsTo(Niveau, { foreignKey: "niveau_id" });

Matiere.belongsTo(Professeur, { foreignKey: "professeur_id" });
Matiere.belongsTo(Parcours, { foreignKey: "parcours_id" });
Matiere.belongsTo(Niveau, { foreignKey: "niveau_id" });
Matiere.belongsTo(Mentions, { foreignKey: "mention_id" });
Matiere.hasMany(Seance, { foreignKey: "matiere_id", as: "seances" });

Seance.belongsTo(Matiere, { foreignKey: "matiere_id" });
Presence.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
Presence.belongsTo(Seance, { foreignKey: "seance_id" });

Absence.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
Absence.belongsTo(Seance, { foreignKey: "seance_id" });
// Absence.belongsTo(PieceJustificative, { foreignKey: "pieceJust_id" });
Absence.hasMany(PieceJustificative, { foreignKey: "absence_id" });
PieceJustificative.belongsTo(Absence, { foreignKey: "absence_id" });

Notification.belongsTo(Etudiant, { foreignKey: "etudiant_id" });

LogAppareil.belongsTo(Etudiant, { foreignKey: "etudiant_id" });
LogAppareil.belongsTo(Seance, { foreignKey: "seance_id" });
LogAppareil.belongsTo(Matiere, { foreignKey: "matiere_id" });

// =========================
// Export
// =========================
module.exports = {
  sequelize,
  Admin,
  Role,
  Etudiant,
  Professeur,
  Parcours,
  Mentions,
  Niveau,
  Matiere,
  Seance,
  Presence,
  Absence,
  PieceJustificative,
  Notification,
  LogAppareil,
};
