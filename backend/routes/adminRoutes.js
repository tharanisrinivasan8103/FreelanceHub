const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

router.get("/dashboard", auth, getDashboardStats);

module.exports = router;
