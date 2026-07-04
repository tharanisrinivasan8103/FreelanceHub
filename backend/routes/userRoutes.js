const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getFreelancers,
  getClients,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

router.get("/",            auth, getAllUsers);
router.get("/freelancers", getFreelancers);
router.get("/clients",     getClients);
router.get("/:id",         auth, getUserById);
router.delete("/:id",      auth, deleteUser);

module.exports = router;
