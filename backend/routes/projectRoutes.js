const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getAllProjects);
router.get("/client", authMiddleware, projectController.getClientProjects);
router.get("/freelancer/dashboard", authMiddleware, projectController.getFreelancerDashboard);

// ✅ NEW: Delete project (Admin)
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
