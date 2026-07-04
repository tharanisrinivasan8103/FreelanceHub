const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  sendMessage,
  getConversation,
  getInbox,
} = require("../controllers/messageController");

// ✅ /contacts → getInbox use பண்றோம் (Chat.js contacts fetch பண்றதுக்கு)
router.get("/contacts",              auth, getInbox);
router.get("/inbox",                 auth, getInbox);
router.get("/conversation/:otherId", auth, getConversation);
router.post("/",                     auth, sendMessage);

module.exports = router;
