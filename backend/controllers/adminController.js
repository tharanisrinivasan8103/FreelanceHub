const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  // 1. Total freelancers
  const q1 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'freelancer'", (err, result) => {
      if (err) return reject(err);
      stats.totalFreelancers = result[0].count;
      resolve();
    });
  });

  // 2. Total clients
  const q2 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'client'", (err, result) => {
      if (err) return reject(err);
      stats.totalClients = result[0].count;
      resolve();
    });
  });

  // 3. Total projects
  const q3 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM projects", (err, result) => {
      if (err) return reject(err);
      stats.totalProjects = result[0].count;
      resolve();
    });
  });

  // 4. Open projects
  const q4 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM projects WHERE status = 'open'", (err, result) => {
      if (err) return reject(err);
      stats.openProjects = result[0].count;
      resolve();
    });
  });

  // 5. In-progress projects
  const q5 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM projects WHERE status = 'in-progress'", (err, result) => {
      if (err) return reject(err);
      stats.inProgressProjects = result[0].count;
      resolve();
    });
  });

  // 6. Completed projects
  const q6 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM projects WHERE status = 'completed'", (err, result) => {
      if (err) return reject(err);
      stats.completedProjects = result[0].count;
      resolve();
    });
  });

  // 7. Total proposals
  const q7 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM proposals", (err, result) => {
      if (err) return reject(err);
      stats.totalProposals = result[0].count;
      resolve();
    });
  });

  // 8. Pending proposals
  const q8 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM proposals WHERE status = 'pending'", (err, result) => {
      if (err) return reject(err);
      stats.pendingProposals = result[0].count;
      resolve();
    });
  });

  // 9. Accepted proposals
  const q9 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM proposals WHERE status = 'accepted'", (err, result) => {
      if (err) return reject(err);
      stats.acceptedProposals = result[0].count;
      resolve();
    });
  });

  // 10. Rejected proposals
  const q10 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM proposals WHERE status = 'rejected'", (err, result) => {
      if (err) return reject(err);
      stats.rejectedProposals = result[0].count;
      resolve();
    });
  });

  // 11. Total submissions
  const q11 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM submissions", (err, result) => {
      if (err) { stats.totalSubmissions = 0; return resolve(); }
      stats.totalSubmissions = result[0].count;
      resolve();
    });
  });

  // 12. Approved submissions
  const q12 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM submissions WHERE status = 'approved'", (err, result) => {
      if (err) { stats.approvedSubmissions = 0; return resolve(); }
      stats.approvedSubmissions = result[0].count;
      resolve();
    });
  });

  // 13. Pending/submitted submissions
  const q13 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM submissions WHERE status = 'submitted'", (err, result) => {
      if (err) { stats.pendingSubmissions = 0; return resolve(); }
      stats.pendingSubmissions = result[0].count;
      resolve();
    });
  });

  // 14. Revision submissions
  const q14 = () => new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM submissions WHERE status = 'revision'", (err, result) => {
      if (err) { stats.revisionSubmissions = 0; return resolve(); }
      stats.revisionSubmissions = result[0].count;
      resolve();
    });
  });

  // 15. Monthly registrations (last 6 months)
  const q15 = () => new Promise((resolve, reject) => {
    db.query(
      `SELECT DATE_FORMAT(created_at, '%b %Y') AS month,
              COUNT(*) AS count
       FROM users
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%b %Y')
       ORDER BY MIN(created_at) ASC`,
      (err, result) => {
        if (err) { stats.monthlyRegistrations = []; return resolve(); }
        stats.monthlyRegistrations = result;
        resolve();
      }
    );
  });

  // Run all queries
  Promise.all([
    q1(), q2(), q3(), q4(), q5(), q6(),
    q7(), q8(), q9(), q10(),
    q11(), q12(), q13(), q14(), q15()
  ])
    .then(() => res.status(200).json(stats))
    .catch((err) => {
      console.error("Admin dashboard error:", err);
      res.status(500).json({ message: err.message });
    });
};
