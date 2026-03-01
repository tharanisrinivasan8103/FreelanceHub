const express = require("express");

const router = express.Router();

const controller = require("../controllers/proposalController");

const authMiddleware = require("../middleware/authMiddleware");


// SEND PROPOSAL (Freelancer)

router.post(

"/",

authMiddleware,

controller.sendProposal

);


// GET PROPOSALS OF PROJECT (Client)

router.get(

"/project/:id",

authMiddleware,

controller.getProjectProposals

);


// GET FREELANCER PROPOSALS

router.get(

"/freelancer/:id",

authMiddleware,

controller.getFreelancerProposals

);


// DELETE PROPOSAL

router.delete(

"/:id",

authMiddleware,

controller.deleteProposal

);


module.exports = router;