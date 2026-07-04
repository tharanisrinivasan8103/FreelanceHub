const db = require("../config/db");

// ✅ exports.dashboard — adminRoutes.js calls controller.dashboard
exports.dashboard = (req, res) => {
  const data = {};

  db.query("SELECT COUNT(*) AS total FROM users WHERE role != 'admin'", (err, r1) => {
    if (err) return res.status(500).json({ message: "DB error" });
    data.users = r1[0].total;

    db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'freelancer'", (err, r2) => {
      if (err) return res.status(500).json({ message: "DB error" });
      data.freelancers = r2[0].total;

      db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'client'", (err, r3) => {
        if (err) return res.status(500).json({ message: "DB error" });
        data.clients = r3[0].total;

        db.query("SELECT COUNT(*) AS total FROM projects", (err, r4) => {
          if (err) return res.status(500).json({ message: "DB error" });
          data.projects = r4[0].total;

          db.query("SELECT COUNT(*) AS total FROM proposals", (err, r5) => {
            if (err) return res.status(500).json({ message: "DB error" });
            data.proposals = r5[0].total;

            res.status(200).json(data);
          });
        });
      });
    });
  });
};
