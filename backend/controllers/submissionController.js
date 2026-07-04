const db = require("../config/db");

// ✅ Freelancer submits work
const submitWork = (req, res) => {
  const freelancer_id = req.user.id;
  const { project_id, description, github_link, live_link } = req.body;

  if (!project_id)  return res.status(400).json({ message: "project_id is required" });
  if (!description) return res.status(400).json({ message: "description is required" });

  db.query(
    "SELECT id FROM submissions WHERE project_id = ? AND freelancer_id = ?",
    [project_id, freelancer_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      if (rows.length > 0) {
        db.query(
          `UPDATE submissions
           SET description=?, github_link=?, live_link=?, status='submitted'
           WHERE project_id=? AND freelancer_id=?`,
          [description, github_link || null, live_link || null, project_id, freelancer_id],
          (err2) => {
            if (err2) return res.status(500).json({ message: "Update failed", error: err2 });
            return res.json({ message: "Submission updated successfully" });
          }
        );
      } else {
        db.query(
          `INSERT INTO submissions (project_id, freelancer_id, description, github_link, live_link, status)
           VALUES (?, ?, ?, ?, ?, 'submitted')`,
          [project_id, freelancer_id, description, github_link || null, live_link || null],
          (err2) => {
            if (err2) return res.status(500).json({ message: "Insert failed", error: err2 });
            return res.status(201).json({ message: "Work submitted successfully" });
          }
        );
      }
    }
  );
};

// ✅ Freelancer: get their own submissions
const getMySubmissions = (req, res) => {
  const freelancer_id = req.user.id;
  db.query(
    `SELECT s.*, p.title AS project_title
     FROM submissions s
     JOIN projects p ON s.project_id = p.id
     WHERE s.freelancer_id = ?
     ORDER BY s.id DESC`,
    [freelancer_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json(rows);
    }
  );
};

// ✅ Client: get all submissions for a project  ← FIXED: added project_title
const getProjectSubmissions = (req, res) => {
  const { projectId } = req.params;

  console.log("getProjectSubmissions called — projectId:", projectId); // debug log

  db.query(
    `SELECT s.*,
            u.name  AS freelancer_name,
            u.email AS freelancer_email,
            p.title AS project_title
     FROM submissions s
     JOIN users    u ON s.freelancer_id = u.id
     JOIN projects p ON s.project_id   = p.id
     WHERE s.project_id = ?
     ORDER BY s.id DESC`,
    [projectId],
    (err, rows) => {
      if (err) {
        console.error("getProjectSubmissions DB error:", err);
        return res.status(500).json({ message: "DB error", error: err });
      }
      console.log("getProjectSubmissions rows:", rows.length); // debug log
      res.json(rows);
    }
  );
};

// ✅ Client: approve or request revision
const updateSubmissionStatus = (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  if (!["approved", "revision"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Use 'approved' or 'revision'" });
  }

  db.query(
    "UPDATE submissions SET status=?, feedback=? WHERE id=?",
    [status, feedback || null, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed", error: err });
      res.json({ message: `Submission ${status} successfully` });
    }
  );
};

module.exports = { submitWork, getMySubmissions, getProjectSubmissions, updateSubmissionStatus };
