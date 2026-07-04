const express = require("express");
const router  = express.Router();

const controller    = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only" });
  }
  next();
};

router.get("/dashboard", authMiddleware, adminOnly, controller.dashboard);

module.exports = router;
