const db = require("../config/db");

// ================= SUBMIT PROJECT =================
exports.submitProject = (req, res) => {
  const { project_id, description, github_link, live_link } = req.body;
  const freelancer_id = req.user.id;

  if (!project_id || !description) {
    return res.status(400).json({ message: "Project and description are required" });
  }

  // Check if already submitted
  db.query(
    "SELECT id FROM submissions WHERE project_id = ? AND freelancer_id = ?",
    [project_id, freelancer_id],
    (err, existing) => {
      if (err) return res.status(500).json({ message: err.message });

      if (existing.length > 0) {
        return res.status(400).json({ message: "You already submitted this project" });
      }

      db.query(
        `INSERT INTO submissions 
         (project_id, freelancer_id, description, github_link, live_link, status) 
         VALUES (?, ?, ?, ?, ?, 'submitted')`,
        [project_id, freelancer_id, description, github_link || null, live_link || null],
        (err, result) => {
          if (err) {
            console.error("Submit Project Error:", err);
            return res.status(500).json({ message: err.message });
          }

          // Update project status to 'in-progress'
          db.query(
            "UPDATE projects SET status = 'in-progress' WHERE id = ?",
            [project_id]
          );

          res.status(201).json({
            message: "Project Submitted Successfully",
            submissionId: result.insertId
          });
        }
      );
    }
  );
};

// ================= GET MY SUBMISSIONS (Freelancer) =================
exports.getMySubmissions = (req, res) => {
  const freelancer_id = req.user.id;

  db.query(
    `SELECT s.*, p.title AS project_title, p.budget AS project_budget
     FROM submissions s
     JOIN projects p ON s.project_id = p.id
     WHERE s.freelancer_id = ?
     ORDER BY s.id DESC`,
    [freelancer_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    }
  );
};

// ================= GET SUBMISSIONS FOR A PROJECT (Client) =================
exports.getProjectSubmissions = (req, res) => {
  const project_id = req.params.id;

  db.query(
    `SELECT s.*, u.name AS freelancer_name, u.email AS freelancer_email,
     p.title AS project_title
     FROM submissions s
     JOIN users u ON s.freelancer_id = u.id
     JOIN projects p ON s.project_id = p.id
     WHERE s.project_id = ?
     ORDER BY s.id DESC`,
    [project_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    }
  );
};

// ================= APPROVE SUBMISSION (Client) =================
exports.approveSubmission = (req, res) => {
  const submission_id = req.params.id;

  db.query(
    "UPDATE submissions SET status = 'approved' WHERE id = ?",
    [submission_id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      // Get project_id to update project status
      db.query(
        "SELECT project_id FROM submissions WHERE id = ?",
        [submission_id],
        (err, result) => {
          if (!err && result.length > 0) {
            db.query(
              "UPDATE projects SET status = 'completed' WHERE id = ?",
              [result[0].project_id]
            );
          }
        }
      );

      res.status(200).json({ message: "Submission Approved! Project Completed." });
    }
  );
};

// ================= REQUEST REVISION (Client) =================
exports.requestRevision = (req, res) => {
  const submission_id = req.params.id;
  const { feedback } = req.body;

  db.query(
    "UPDATE submissions SET status = 'revision', feedback = ? WHERE id = ?",
    [feedback || "Please revise and resubmit.", submission_id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Revision Requested" });
    }
  );
};