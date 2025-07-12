const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.get("/:orderId", (req, res) => {
  const { orderId } = req.params;

  const query =
    "SELECT id AS orderId, total_price AS totalPrice, qr_code AS qrCode FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ message: "Error fetching order." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(results[0]);
  });
});

// Update payment status
router.get("/payment/:orderId", (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  const query = `UPDATE orders SET is_paid = 1 WHERE id = ?`;
  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      return res
        .status(400)
        .json({ message: "Error updating payment status." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Payment successful." });
  });
});

router.get("/status/:orderId", (req, res) => {
  const { orderId } = req.params;

  const queryOrder = `
    SELECT id AS orderId, user_id, total_price, is_paid, created_at
    FROM orders
    WHERE id = ?
  `;

  db.query(queryOrder, [orderId], (err, orderResults) => {
    if (err) {
      console.error("Error checking payment status:", err);
      return res
        .status(500)
        .json({ message: "Error checking payment status." });
    }

    if (orderResults.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orderResults[0];

    const queryItems = `
      SELECT p.name AS product_name, oi.quantity, oi.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.query(queryItems, [orderId], (err, itemResults) => {
      if (err) {
        console.error("Error fetching order items:", err);
        return res.status(500).json({ message: "Error fetching order items." });
      }

      res.json({
        is_paid: order.is_paid,
        total_price: order.total_price,
        created_at: order.created_at,
        order_items: itemResults,
      });
    });
  });
});

router.post("/callback", express.json(), (req, res) => {
  const { merchant_ref, status } = req.body;

  if (status !== "PAID") {
    return res.status(400).json({ message: "Not a successful payment." });
  }

  // Ambil order ID dari merchant_ref
  const match = merchant_ref.match(/^ORDER-(\d+)-/);
  const orderId = match ? match[1] : null;

  if (!orderId) {
    return res.status(400).json({ message: "Invalid order ID." });
  }

  const query = `UPDATE orders SET is_paid = 1 WHERE id = ?`;
  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("❌ Error updating payment status:", err);
      return res.status(500).json({ message: "DB update failed." });
    }

    console.log(`✅ Order ${orderId} marked as paid.`);
    res.status(200).json({ message: "Payment status updated." });
  });
});

module.exports = router;
