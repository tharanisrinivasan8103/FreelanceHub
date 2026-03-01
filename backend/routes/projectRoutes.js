const express = require("express");
const router = express.Router();
const { getClientProjects } = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/client", authMiddleware, getClientProjects);

module.exports = router;