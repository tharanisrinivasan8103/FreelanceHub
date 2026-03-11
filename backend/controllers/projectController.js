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
// GET CLIENT PROJECTS
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
// GET ALL PROJECTS
// ===============================
exports.getAllProjects = (req, res) => {
  // ✅ proposal count JOIN பண்றோம்
  const query = `
    SELECT 
      p.*,
      COUNT(pr.id) AS proposalsCount
    FROM projects p
    LEFT JOIN proposals pr ON p.id = pr.project_id
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
// ✅ FIX: pr.bid also fetch பண்றோம்
// ===============================
exports.getFreelancerDashboard = (req, res) => {
  const freelancerId = req.user.id;

  if (!freelancerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const proposalCountQuery = `
    SELECT COUNT(*) AS totalProposals
    FROM proposals
    WHERE freelancer_id = ?
  `;

  db.query(proposalCountQuery, [freelancerId], (err, proposalResult) => {
    if (err) {
      console.error("Proposal Count Error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const totalProposals = proposalResult[0]?.totalProposals || 0;

    // ✅ pr.bid, pr.status also include பண்றோம்
    const projectQuery = `
      SELECT 
        p.id, p.title, p.description, p.budget, p.category, p.client_id,
        pr.bid        AS my_bid,
        pr.status     AS proposal_status
      FROM projects p
      INNER JOIN proposals pr ON p.id = pr.project_id
      WHERE pr.freelancer_id = ?
      ORDER BY p.id DESC
    `;

    db.query(projectQuery, [freelancerId], (err, projectResult) => {
      if (err) {
        console.error("Project Fetch Error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      const projects = projectResult || [];

      res.status(200).json({
        activeProjects: projects.length,
        pendingProposals: totalProposals,
        projects: projects
      });
    });
  });
};

// ===============================
// DELETE PROJECT (Admin)
// ===============================
exports.deleteProject = (req, res) => {
  const project_id = req.params.id;
  // Delete proposals first, then project
  db.query("DELETE FROM proposals WHERE project_id = ?", [project_id], (err) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    db.query("DELETE FROM projects WHERE id = ?", [project_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server Error" });
      res.status(200).json({ message: "Project deleted successfully" });
    });
  });
};
