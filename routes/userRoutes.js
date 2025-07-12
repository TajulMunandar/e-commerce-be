const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const router = express.Router();

// Register user
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(400).json({ message: "Error registering user." });
    }

    const token = jwt.sign({ userId: result.insertId }, "secretkey", {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  });
});

// Login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(400).json({ message: "Error logging in." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ userId: user.id }, "secretkey", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  });
});

module.exports = router;
