const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// Create new project (Client)
router.post("/", authMiddleware, projectController.createProject);

// Get ALL projects (Freelancer - Find Projects page)
router.get("/", authMiddleware, projectController.getAllProjects);

// Get projects posted by logged-in client
router.get("/client", authMiddleware, projectController.getClientProjects);

// Get freelancer dashboard data (both routes supported)
router.get("/freelancer/dashboard", authMiddleware, projectController.getFreelancerDashboard);
router.get("/freelancer", authMiddleware, projectController.getFreelancerDashboard);

// Delete project (Admin/Client)
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
