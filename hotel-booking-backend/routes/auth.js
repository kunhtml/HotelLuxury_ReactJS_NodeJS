const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, hashedPassword]
    );

    // Get the inserted user
    const [user] = await pool.query(
      "SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?",
      [result.insertId]
    );

    // Store user in session
    req.session.user = {
      id: user[0].id,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      email: user[0].email,
      phone: user[0].phone,
      role: user[0].role,
    };

    res.status(201).json({
      user: {
        id: user[0].id,
        firstName: user[0].first_name,
        lastName: user[0].last_name,
        email: user[0].email,
        phone: user[0].phone,
        role: user[0].role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: users[0].id,
      firstName: users[0].first_name,
      lastName: users[0].last_name,
      email: users[0].email,
      phone: users[0].phone,
      role: users[0].role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Create admin account (for demo purposes)
router.post("/create-admin", async (req, res) => {
  try {
    // Check if admin already exists
    const [existingAdmins] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@example.com"]
    );

    if (existingAdmins.length > 0) {
      return res.json({
        success: true,
        message: "Admin account already exists",
        user: {
          id: existingAdmins[0].id,
          firstName: existingAdmins[0].first_name,
          lastName: existingAdmins[0].last_name,
          email: existingAdmins[0].email,
          phone: existingAdmins[0].phone,
          role: existingAdmins[0].role,
        },
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Insert admin user
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "Admin",
        "User",
        "admin@example.com",
        "123-456-7890",
        hashedPassword,
        "admin",
      ]
    );

    // Get the inserted user
    const [user] = await pool.query(
      "SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: user[0].id,
        firstName: user[0].first_name,
        lastName: user[0].last_name,
        email: user[0].email,
        phone: user[0].phone,
        role: user[0].role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
