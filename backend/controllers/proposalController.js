const db = require("../config/db");

// ================= SEND PROPOSAL =================
exports.sendProposal = (req, res) => {
  const { project_id, bid, message } = req.body;
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const freelancer_id = req.user.id;
  if (!project_id || !bid || !message)
    return res.status(400).json({ message: "All fields are required" });

  // Check if already applied
  db.query(
    "SELECT id FROM proposals WHERE project_id = ? AND freelancer_id = ?",
    [project_id, freelancer_id],
    (err, existing) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      if (existing.length > 0)
        return res.status(400).json({ message: "Already applied to this project" });

      db.query(
        "INSERT INTO proposals (project_id, freelancer_id, bid, message) VALUES (?, ?, ?, ?)",
        [project_id, freelancer_id, bid, message],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Server Error" });
          res.status(201).json({ message: "Proposal Sent Successfully", proposalId: result.insertId });
        }
      );
    }
  );
};

// ================= GET PROPOSALS FOR A PROJECT =================
exports.getProjectProposals = (req, res) => {
  const project_id = req.params.id;
  db.query(
    `SELECT proposals.*, users.name AS freelancer_name, users.email AS freelancer_email
     FROM proposals
     JOIN users ON proposals.freelancer_id = users.id
     WHERE project_id = ?
     ORDER BY proposals.id DESC`,
    [project_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(result);
    }
  );
};

// ================= GET LOGGED-IN FREELANCER PROPOSALS =================
exports.getMyProposals = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const freelancer_id = req.user.id;
  db.query(
    `SELECT proposals.*, projects.title AS project_title, projects.budget AS project_budget, projects.deadline AS project_deadline
     FROM proposals
     JOIN projects ON proposals.project_id = projects.id
     WHERE freelancer_id = ?
     ORDER BY proposals.id DESC`,
    [freelancer_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      res.status(200).json(result);
    }
  );
};

// ================= GET FREELANCER PROPOSALS (BY PARAM ID) =================
exports.getFreelancerProposals = (req, res) => {
  const freelancer_id = req.params.id;
  db.query(
    `SELECT proposals.*, projects.title AS project_title
     FROM proposals
     JOIN projects ON proposals.project_id = projects.id
     WHERE freelancer_id = ?`,
    [freelancer_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(result);
    }
  );
};

// ================= ACCEPT / REJECT PROPOSAL =================
exports.updateProposalStatus = (req, res) => {
  const proposal_id = req.params.id;
  const { status } = req.body; // "accepted" or "rejected"

  if (!["accepted", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  db.query(
    "UPDATE proposals SET status = ? WHERE id = ?",
    [status, proposal_id],
    (err) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      res.status(200).json({ message: `Proposal ${status} successfully` });
    }
  );
};

// ================= DELETE PROPOSAL =================
exports.deleteProposal = (req, res) => {
  const proposal_id = req.params.id;
  db.query("DELETE FROM proposals WHERE id = ?", [proposal_id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Proposal Deleted Successfully" });
  });
};
