const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, gender, dob } = req.body;
    console.log("Register Request:user is registering }");
    // check all fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // insert user
    db.query(
      "INSERT INTO users (name, email, password, role, phone, gender, dob) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hash, role, phone || null, gender || null, dob || null],
      (err, result) => {
        if (err) {
          console.error("Register DB Error:", err);
          return res.status(500).json({ message: err.message });
        }

        res.status(201).json({
          message: "User Registered Successfully"
        });
      }
    );
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const valid = await bcrypt.compare(
        password,
        result[0].password
      );

      if (!valid) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        {
          id: result[0].id,
          role: result[0].role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          role: result[0].role
        }
      });
    }
  );
};