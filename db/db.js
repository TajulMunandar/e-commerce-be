const mysql = require("mysql2");

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost", // Ganti sesuai host MySQL kamu
  user: "root", // Username MySQL kamu
  password: "", // Password MySQL kamu
  database: "e-commerce", // Nama database yang mau dipakai
});

// Connect ke database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

module.exports = db;
