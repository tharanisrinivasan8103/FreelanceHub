const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getFreelancers,
  getClients,
  getUserById,
  deleteUser
} = require("../controllers/userController");
const db = require("../config/db");

// ✅ PROFILE ROUTES MUST BE FIRST - before /:id
router.get("/profile", auth, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT id, name, email, bio, skills, phone, role, created_at FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Profile fetch error:", err);
        return res.status(500).json({ message: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(result[0]);
    }
  );
});

router.put("/profile", auth, (req, res) => {
  const userId = req.user.id;
  const { name, email, bio, skills, phone } = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, bio=?, skills=?, phone=? WHERE id=?",
    [name, email, bio || null, skills || null, phone || null, userId],
    (err) => {
      if (err) {
        console.error("Profile update error:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "Profile updated successfully" });
    }
  );
});

// These must come AFTER /profile
router.get("/", auth, getAllUsers);
router.get("/freelancers", auth, getFreelancers);
router.get("/clients", auth, getClients);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, deleteUser);

module.exports = router;