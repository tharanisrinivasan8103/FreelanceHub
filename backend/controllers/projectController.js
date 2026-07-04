const db = require("../config/db");

// ===============================
// CREATE PROJECT
// ===============================
exports.createProject = (req, res) => {
  const { title, description, budget, category, skills, deadline } = req.body;
  const client_id = req.user.id;

  if (!title || !description || !budget || !category) {
    return res.status(400).json({
      message: "Title, Description, Budget and Category are required"
    });
  }

  db.query(
    `INSERT INTO projects (title, description, budget, category, skills, deadline, client_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, budget, category, skills || null, deadline || null, client_id],
    (err, result) => {
      if (err) {
        console.error("Create Project Error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({
        message: "Project Created Successfully",
        projectId: result.insertId
      });
    }
  );
};

// ===============================
// GET PROJECTS FOR LOGGED-IN CLIENT
// ===============================
exports.getClientProjects = (req, res) => {
  const clientId = req.user.id;
  db.query(
    "SELECT * FROM projects WHERE client_id = ? ORDER BY id DESC",
    [clientId],
    (err, results) => {
      if (err) {
        console.error("Client Projects Error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(200).json(results);
    }
  );
};

// ===============================
// GET ALL PROJECTS (Freelancer browse)
// ===============================
exports.getAllProjects = (req, res) => {
  const query = `
    SELECT p.*,
           u.name AS client_name,
           COUNT(pr.id) AS proposals_count
    FROM projects p
    LEFT JOIN users u ON p.client_id = u.id
    LEFT JOIN proposals pr ON pr.project_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
};

// ===============================
// FREELANCER DASHBOARD
// ✅ FIXED: returns correct proposal_status and bid from DB in real-time
// ===============================
exports.getFreelancerDashboard = (req, res) => {
  const freelancerId = req.user.id;

  if (!freelancerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Step 1: total proposals count
  db.query(
    "SELECT COUNT(*) AS totalProposals FROM proposals WHERE freelancer_id = ?",
    [freelancerId],
    (err, proposalResult) => {
      if (err) return res.status(500).json({ message: "Server error" });

      const totalProposals = proposalResult[0]?.totalProposals || 0;

      // Step 2: all projects this freelancer applied to — fresh status every time
      db.query(
        `SELECT
           p.id,
           p.title,
           p.description,
           p.budget,
           p.category,
           p.client_id,
           p.deadline,
           pr.id        AS proposal_id,
           pr.bid       AS my_bid,
           pr.status    AS proposal_status
         FROM projects p
         INNER JOIN proposals pr ON p.id = pr.project_id
         WHERE pr.freelancer_id = ?
         ORDER BY p.id DESC`,
        [freelancerId],
        (err, projectResult) => {
          if (err) return res.status(500).json({ message: "Server error" });

          res.status(200).json({
            activeProjects:   (projectResult || []).length,
            pendingProposals: totalProposals,
            projects:         projectResult || []
          });
        }
      );
    }
  );
};

// ===============================
// DELETE PROJECT (Admin / Client)
// ===============================
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const query = userRole === "admin"
    ? "DELETE FROM projects WHERE id = ?"
    : "DELETE FROM projects WHERE id = ? AND client_id = ?";

  const params = userRole === "admin" ? [id] : [id, userId];

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Project not found or unauthorized" });
    res.json({ message: "Project deleted successfully" });
  });
};
