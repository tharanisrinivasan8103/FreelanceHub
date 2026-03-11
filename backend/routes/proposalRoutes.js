const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, proposalController.sendProposal);
router.get("/project/:id", authMiddleware, proposalController.getProjectProposals);
router.get("/freelancer/:id", authMiddleware, proposalController.getFreelancerProposals);
router.get("/my", authMiddleware, proposalController.getMyProposals);

// ✅ NEW: Accept / Reject
router.put("/:id/status", authMiddleware, proposalController.updateProposalStatus);

router.delete("/:id", authMiddleware, proposalController.deleteProposal);

module.exports = router;
