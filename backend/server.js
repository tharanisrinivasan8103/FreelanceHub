const express = require("express");
const cors = require("cors");
require("dotenv").config();

// database connection
const db = require("./config/db");

const app = express();


// middleware
app.use(cors());
app.use(express.json());


// test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});


// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/proposals", require("./routes/proposalRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


// handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// port
const PORT = process.env.PORT || 5000;


// start server
app.listen(PORT, () => {

console.log("=================================");
console.log(`Server running on port ${PORT}`);
console.log("Backend + MySQL Connected");
console.log("=================================");

});