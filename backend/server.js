const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ================= DATABASE =================
const db = require("./config/db");

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/admin", adminRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= PORT =================
const PORT = process.env.PORT || 5000;

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log("Backend + MySQL Connected");
  console.log("=================================");

  // ✅ DEFAULT ADMIN AUTO-CREATE
  createDefaultAdmin();
});

// ======================================================
// DEFAULT ADMIN FUNCTION
// ======================================================
const createDefaultAdmin = () => {
  const adminEmail = "tharani123@gmail.com";
  const adminPassword = "1234567890";
  const adminName = "Admin";

  // Already exist 
  const checkQuery = "SELECT * FROM users WHERE email = ?";

  db.query(checkQuery, [adminEmail], async (err, results) => {
    if (err) {
      console.log("Admin check error:", err);
      return;
    }

    if (results.length > 0) {
      // Already exists — skip
      console.log("✅ Default admin already exists");
      return;
    }

    // Admin இல்ல — create பண்றோம்
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const insertQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(
      insertQuery,
      [adminName, adminEmail, hashedPassword, "admin"],
      (err, result) => {
        if (err) {
          console.log("❌ Admin creation error:", err);
        } else {
          console.log("=================================");
          console.log("✅ Default Admin Created!");
          console.log("   Email   : tharani123@gmail.com");
          console.log("   Password: 1234567890");
          console.log("=================================");
        }
      }
    );
  });
};
