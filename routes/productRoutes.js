const express = require("express");
const db = require("../db/db");

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  const query = `SELECT * FROM products`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(400).json({ message: "Error fetching products." });
    }
    res.json(results);
  });
});

// Add a product
router.post("/", (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  if (!name || !price || stock === undefined) {
    return res
      .status(400)
      .json({ message: "Name, price, and stock are required." });
  }

  const query = `INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    query,
    [name, description, price, stock, image_url],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(400).json({ message: "Error adding product." });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
});

module.exports = router;
