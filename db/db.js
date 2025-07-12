const mysql = require("mysql2");

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: "e-commerce.developerdadakan.com", // Ganti sesuai host MySQL kamu
  user: "u1585994_e-commerce", // Username MySQL kamu
  password: "aeibWTe1.j-0", // Password MySQL kamu
  database: "u1585994_e-commerce", // Nama database yang mau dipakai
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
