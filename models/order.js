const db = require("../db/db");

const createOrderTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      qr_code TEXT,
      is_paid TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error creating orders table:", err);
    } else {
      console.log("Orders table created or already exists.");
    }
  });
};

module.exports = { createOrderTable };
