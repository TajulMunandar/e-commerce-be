const db = require("../db/db");

const createOrderItemTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error creating order_items table:", err);
    } else {
      console.log("Order_items table created or already exists.");
    }
  });
};

module.exports = { createOrderItemTable };
