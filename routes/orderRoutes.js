const express = require("express");
const db = require("../db/db");
const { createQRIS } = require("../utils/qrCode"); // A helper for generating QR codes
const { generateQRCode } = require("../utils/qr-code");
const router = express.Router();

// Create an order
// router.post("/", async (req, res) => {
//   const { user_id, products } = req.body;

//   if (!user_id || !products || products.length === 0) {
//     return res
//       .status(400)
//       .json({ message: "User ID and products are required." });
//   }

//   let totalPrice = 0;
//   products.forEach((product) => {
//     totalPrice += product.price * product.quantity;
//   });

//   const insertOrderQuery = `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`;

//   db.query(insertOrderQuery, [user_id, totalPrice], async (err, result) => {
//     if (err) {
//       console.error("Error creating order:", err);
//       return res.status(400).json({ message: "Error creating order." });
//     }

//     const orderId = result.insertId;

//     // 🛠 Tambahkan await
//     const qrCode = await createQRIS(orderId, totalPrice);

//     if (!qrCode) {
//       console.error("Failed to generate QR code.");
//       return res.status(500).json({ message: "Failed to generate QR code." });
//     }

//     const updateQrQuery = `UPDATE orders SET qr_code = ? WHERE id = ?`;
//     db.query(updateQrQuery, [qrCode, orderId], (err) => {
//       if (err) {
//         console.error("Error updating QR code:", err);
//         return res.status(400).json({ message: "Error updating QR code." });
//       }

//       products.forEach((product) => {
//         const insertOrderItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
//         db.query(
//           insertOrderItemQuery,
//           [orderId, product.product_id, product.quantity, product.price],
//           (err) => {
//             if (err) {
//               console.error("Error inserting order item:", err);
//               return res
//                 .status(400)
//                 .json({ message: "Error inserting order item." });
//             }
//           }
//         );
//       });

//       res.status(201).json({ orderId, qrCode, totalPrice });
//     });
//   });
// });

router.post("/", async (req, res) => {
  const { user_id, products } = req.body;

  if (!user_id || !products || products.length === 0) {
    return res
      .status(400)
      .json({ message: "User ID and products are required." });
  }

  let totalPrice = 0;
  products.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });

  const insertOrderQuery = `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`;

  db.query(insertOrderQuery, [user_id, totalPrice], async (err, result) => {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(400).json({ message: "Error creating order." });
    }

    const orderId = result.insertId;

    // 🛠 Tambahkan await
    const qrCode = await generateQRCode(orderId);

    if (!qrCode) {
      console.error("Failed to generate QR code.");
      return res.status(500).json({ message: "Failed to generate QR code." });
    }

    const updateQrQuery = `UPDATE orders SET qr_code = ? WHERE id = ?`;
    db.query(updateQrQuery, [qrCode, orderId], (err) => {
      if (err) {
        console.error("Error updating QR code:", err);
        return res.status(400).json({ message: "Error updating QR code." });
      }

      products.forEach((product) => {
        const insertOrderItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
        db.query(
          insertOrderItemQuery,
          [orderId, product.product_id, product.quantity, product.price],
          (err) => {
            if (err) {
              console.error("Error inserting order item:", err);
              return res
                .status(400)
                .json({ message: "Error inserting order item." });
            }
          }
        );
      });

      res.status(201).json({ orderId, qrCode, totalPrice });
    });
  });
});

router.get("/user/:user_id", (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const getOrdersQuery = `
    SELECT o.id, o.total_price, o.is_paid, o.created_at,
           GROUP_CONCAT(p.name) AS product_names, 
           GROUP_CONCAT(op.quantity) AS quantities
    FROM orders o
    JOIN order_items op ON o.id = op.order_id
    JOIN products p ON op.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
  `;

  db.query(getOrdersQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    // Format response
    const orders = results.map((order) => ({
      id: order.id,
      totalPrice: order.total_price,
      status: order.is_paid === 1 ? "Lunas" : "Belum Bayar", // Status 'belum bayar' or 'lunas'
      createdAt: order.created_at,
      products: order.product_names.split(","),
      quantities: order.quantities.split(","),
    }));

    res.status(200).json(orders);
  });
});

module.exports = router;
