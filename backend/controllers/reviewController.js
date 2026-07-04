const db = require("../config/db");

// ================= SUBMIT REVIEW =================
// DB columns: project_id, client_id, freelancer_id, rating, review, created_at
exports.submitReview = (req, res) => {
  const { project_id, freelancer_id, rating, review: comment } = req.body;
  const client_id = req.user.id;

  if (!project_id || !freelancer_id || !rating)
    return res.status(400).json({ message: "project_id, freelancer_id, rating required" });

  // First check if a review already exists for this project by this client
  db.query(
    `SELECT id FROM reviews WHERE project_id = ? AND client_id = ?`,
    [project_id, client_id],
    (err, existing) => {
      if (err) {
        console.error("submitReview check error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }

      if (existing.length > 0) {
        return res.status(409).json({ message: "You have already submitted a review for this project." });
      }

      db.query(
        `INSERT INTO reviews (project_id, client_id, freelancer_id, rating, review)
         VALUES (?, ?, ?, ?, ?)`,
        [project_id, client_id, freelancer_id, rating, comment || ""],
        (err, result) => {
          if (err) {
            // Fallback: handle unique constraint violation at DB level
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({ message: "You have already submitted a review for this project." });
            }
            console.error("submitReview error:", err);
            return res.status(500).json({ message: "Server Error", error: err.message });
          }
          res.status(201).json({ message: "Review submitted!" });
        }
      );
    }
  );
};

// ================= GET REVIEWS BY CLIENT (to mark already-reviewed projects) =================
exports.getClientReviews = (req, res) => {
  const client_id = req.user.id;

  db.query(
    `SELECT project_id, freelancer_id, rating, review FROM reviews WHERE client_id = ?`,
    [client_id],
    (err, result) => {
      if (err) {
        console.error("getClientReviews error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }
      res.json(result);
    }
  );
};

// ================= GET FREELANCER REVIEWS =================
exports.getFreelancerReviews = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT r.*, u.name AS client_name
     FROM reviews r
     JOIN users u ON r.client_id = u.id
     WHERE r.freelancer_id = ?
     ORDER BY r.created_at DESC`,
    [id],
    (err, result) => {
      if (err) {
        console.error("getFreelancerReviews error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }
      res.json(result);
    }
  );
};
