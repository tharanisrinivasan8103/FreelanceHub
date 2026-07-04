const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  submitReview,
  getFreelancerReviews,
  getClientReviews,
} = require("../controllers/reviewController");

router.post("/",         auth, submitReview);
router.get("/my",        auth, getClientReviews);   // NEW: fetch client's own reviews
router.get("/:id",       getFreelancerReviews);

module.exports = router;
