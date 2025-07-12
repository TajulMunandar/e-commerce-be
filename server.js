const express = require("express");
const { createUserTable } = require("./models/user");
const { createProductTable } = require("./models/product");
const { createOrderTable } = require("./models/order");
const { createOrderItemTable } = require("./models/orderItem");

const app = express();

// Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Set up database
const setupDatabase = async () => {
  try {
    await createUserTable();
    await createProductTable();
    await createOrderTable();
    await createOrderItemTable();
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error setting up the database:", error);
    process.exit(1);
  }
};

// Initialize DB before starting the server
setupDatabase().then(() => {
  // Routes
  const userRoutes = require("./routes/userRoutes");
  const productRoutes = require("./routes/productRoutes");
  const orderRoutes = require("./routes/orderRoutes");
  const paymentRoutes = require("./routes/payment");

  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payment", paymentRoutes);

  // Start Server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
