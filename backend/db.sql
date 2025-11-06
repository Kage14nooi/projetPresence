CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_nom VARCHAR(50) NOT NULL,
    admin_prenom VARCHAR(50) NOT NULL,
    admin_mdp VARCHAR(255) NOT NULL
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_type VARCHAR(255) NOT NULL
);

CREATE TABLE etudiant (
    etudiant_id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_nom VARCHAR(50) NOT NULL,
    etudiant_prenom VARCHAR(50) NOT NULL,
    etudiant_matricule VARCHAR(20) NOT NULL UNIQUE,
    etudiant_niveau VARCHAR(30),
    etudiant_parcours VARCHAR(255),
    etudiant_mail VARCHAR(50),
    etudiant_tel VARCHAR(20),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE professeur (
    professeur_id INT AUTO_INCREMENT PRIMARY KEY,
    professeur_nom VARCHAR(50) NOT NULL,
    professeur_prenom VARCHAR(50) NOT NULL,
    professeur_mail VARCHAR(50),
    professeur_tel VARCHAR(20)
);

CREATE TABLE parcours (
    parcours_id INT AUTO_INCREMENT PRIMARY KEY,
    parcours_nom VARCHAR(125) NOT NULL
);

CREATE TABLE matiere (
    matiere_id INT AUTO_INCREMENT PRIMARY KEY,
    matiere_nom VARCHAR(50) NOT NULL,
    matiere_heureDebut TIME,
    matiere_heureFin TIME,
    professeur_id INT,
    parcours_id INT,
    FOREIGN KEY (professeur_id) REFERENCES professeur(professeur_id),
    FOREIGN KEY (parcours_id) REFERENCES parcours(parcours_id)
);

CREATE TABLE piece_justificative (
    pieceJust_id INT AUTO_INCREMENT PRIMARY KEY,
    pieceJust_description VARCHAR(255) NOT NULL
);

CREATE TABLE presence (
    presence_id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    matiere_id INT,
    date_presence DATE NOT NULL,
    heure_entree TIME,
    heure_sortie TIME,
    status ENUM('P','A') DEFAULT 'A',
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(etudiant_id),
    FOREIGN KEY (matiere_id) REFERENCES matiere(matiere_id)
);

CREATE TABLE absence (
    absence_id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    date_absence DATE NOT NULL,
    motif ENUM('Maladie','Evénement familial','Autres') NOT NULL,
    pieceJust_id INT,
    observation TEXT,
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(etudiant_id),
    FOREIGN KEY (pieceJust_id) REFERENCES piece_justificative(pieceJust_id)
);

CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT,
    objet VARCHAR(50),
    description TEXT,
    date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(etudiant_id)
);

CREATE TABLE log_appareil (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    matiere_id INT,
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(etudiant_id),
    FOREIGN KEY (matiere_id) REFERENCES matiere(matiere_id)
);
