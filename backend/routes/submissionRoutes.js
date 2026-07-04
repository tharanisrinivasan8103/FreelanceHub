const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
  submitWork,
  getMySubmissions,
  getProjectSubmissions,
  updateSubmissionStatus,
} = require("../controllers/submissionController");

// POST   /api/submissions              → Freelancer submits work
router.post("/",                       auth, submitWork);

// GET    /api/submissions/my           → Freelancer views their own submissions
router.get("/my",                      auth, getMySubmissions);

// GET    /api/submissions/project/:projectId → Client views submissions for a project
router.get("/project/:projectId",      auth, getProjectSubmissions);

// PUT    /api/submissions/:id/status   → Client approves or requests revision
router.put("/:id/status",              auth, updateSubmissionStatus);

module.exports = router;
