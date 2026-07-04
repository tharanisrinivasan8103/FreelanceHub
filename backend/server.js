const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// Routes
const authRoutes       = require("./routes/authRoutes");
const userRoutes       = require("./routes/userRoutes");
const projectRoutes    = require("./routes/projectRoutes");
const proposalRoutes   = require("./routes/proposalRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const adminRoutes      = require("./routes/adminRoutes");
const reviewRoutes     = require("./routes/reviewRoutes");
const messageRoutes    = require("./routes/messageRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend Running Successfully"));

// API Routes
app.use("/api/auth",        authRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/projects",    projectRoutes);
app.use("/api/proposals",   proposalRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin",       adminRoutes);
app.use("/api/reviews",     reviewRoutes);
app.use("/api/messages",    messageRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log("=================================");

    const bcrypt = require("bcryptjs");
    const adminEmail = "tharani123@gmail.com";
    db.query("SELECT id FROM users WHERE email=?", [adminEmail], async (err, rows) => {
      if (!err && rows.length === 0) {
        const hash = await bcrypt.hash("1234567890", 10);
        db.query("INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
          ["Admin", adminEmail, hash, "admin"]);
        console.log("✅ Default admin created");
      }
    });
  });
}
