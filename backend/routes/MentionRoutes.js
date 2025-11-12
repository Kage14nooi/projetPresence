const express = require("express");
const router = express.Router();
const MentionController = require("../controllers/MentionController");

router.post("/", MentionController.createMention);
router.get("/", MentionController.getMention);
router.get("/:id", MentionController.getMentionById);
router.get("/nom/:nom", MentionController.searchMentionByNom);
router.put("/:id", MentionController.updateMention);
router.delete("/:id", MentionController.deleteMention);

module.exports = router;
