const db = require("../config/db");


// ===============================
// CREATE PROJECT (Logged-in Client)
// ===============================
exports.createProject = (req, res) => {

  const { title, description, budget } = req.body;

  const client_id = req.user.id; // take from JWT

  if (!title || !description || !budget) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "INSERT INTO projects (title, description, budget, client_id) VALUES (?, ?, ?, ?)",
    [title, description, budget, client_id],
    (err, result) => {

      if (err) {
        console.error(err);
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
// GET ALL PROJECTS (Admin use)
// ===============================
exports.getAllProjects = (req, res) => {

  db.query(
    `SELECT projects.*, users.name AS client_name
     FROM projects
     JOIN users ON projects.client_id = users.id`,
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      res.status(200).json(result);
    }
  );
};



// ===============================
// GET PROJECTS FOR LOGGED-IN CLIENT
// ===============================
exports.getClientProjects = (req, res) => {

  const clientId = req.user.id;   // coming from JWT

  const query = `
    SELECT *
    FROM projects
    WHERE client_id = ?
    ORDER BY id DESC
  `;

  db.query(query, [clientId], (err, results) => {

    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
};



// ===============================
// GET SINGLE PROJECT
// ===============================
exports.getSingleProject = (req, res) => {

  const project_id = req.params.id;

  db.query(
    "SELECT * FROM projects WHERE id = ?",
    [project_id],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      res.status(200).json(result[0]);
    }
  );
};



// ===============================
// DELETE PROJECT
// ===============================
exports.deleteProject = (req, res) => {

  const project_id = req.params.id;

  db.query(
    "DELETE FROM projects WHERE id = ?",
    [project_id],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      res.status(200).json({
        message: "Project deleted successfully"
      });
    }
  );
};