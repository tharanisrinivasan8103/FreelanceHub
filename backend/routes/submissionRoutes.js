const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  submitProject,
  getMySubmissions,
  getProjectSubmissions,
  approveSubmission,
  requestRevision
} = require("../controllers/submissionController");

router.post("/", auth, submitProject);
router.get("/my", auth, getMySubmissions);
router.get("/project/:id", auth, getProjectSubmissions);
router.put("/:id/approve", auth, approveSubmission);
router.put("/:id/revision", auth, requestRevision);

module.exports = router;