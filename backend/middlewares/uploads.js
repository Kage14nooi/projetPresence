const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("🟦 [UPLOAD] Destination appelée");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("🟩 [UPLOAD] Fichier reçu :", file.originalname);
    const newName = Date.now() + "-" + file.originalname;
    console.log("🟩 [UPLOAD] Nouveau nom généré :", newName);
    cb(null, newName);
  },
});

const upload = multer({ storage });

module.exports = upload;
