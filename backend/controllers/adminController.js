const db = require("../config/db");


// Admin Dashboard

exports.dashboard = (req, res) => {

  const dashboardData = {};

  // Total Users
  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, userResult) => {

    if (err) {
      return res.status(500).send(err);
    }

    dashboardData.users = userResult[0].totalUsers;


    // Total Projects
    db.query("SELECT COUNT(*) AS totalProjects FROM projects", (err, projectResult) => {

      if (err) {
        return res.status(500).send(err);
      }

      dashboardData.projects = projectResult[0].totalProjects;


      // Total Proposals
      db.query("SELECT COUNT(*) AS totalProposals FROM proposals", (err, proposalResult) => {

        if (err) {
          return res.status(500).send(err);
        }

        dashboardData.proposals = proposalResult[0].totalProposals;


        // Final response
        res.status(200).json(dashboardData);

      });

    });

  });

};