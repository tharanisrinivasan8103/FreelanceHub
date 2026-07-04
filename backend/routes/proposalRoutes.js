const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  sendProposal,
  getProjectProposals,
  getMyProposals,
  getFreelancerProposals,
  updateProposalStatus,
  deleteProposal,
} = require("../controllers/proposalController");

router.post("/",                  auth, sendProposal);
router.get("/my",                 auth, getMyProposals);
router.get("/project/:id",        auth, getProjectProposals);
router.get("/freelancer/:id",     auth, getFreelancerProposals);
router.put("/:id/status",         auth, updateProposalStatus);
router.delete("/:id",             auth, deleteProposal);

module.exports = router;
