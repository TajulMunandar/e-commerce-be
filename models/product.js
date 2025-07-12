const db = require("../db/db");

const createProductTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT NOT NULL,
      image_url TEXT
    );
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error creating products table:", err);
    } else {
      console.log("Products table created or already exists.");
    }
  });
};

module.exports = { createProductTable };
