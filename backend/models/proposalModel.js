const Proposal = require("../models/proposalModel");

// ================= SEND PROPOSAL =================
exports.sendProposal = (req, res) => {
  const { project_id, bid, message } = req.body;

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const freelancer_id = req.user.id; // 🔥 from token

  if (!project_id || !bid || !message) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  Proposal.createProposal(
    project_id,
    freelancer_id,
    bid,
    message,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Server Error",
        });
      }

      res.status(201).json({
        message: "Proposal Sent Successfully",
        proposalId: result.insertId,
      });
    }
  );
};