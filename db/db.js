const mysql = require("mysql2");

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: "mysql.railway.internal", // Ganti sesuai host MySQL kamu
  user: "root", // Username MySQL kamu
  password: "NNvTtaWBTMyysjPvsGPxLHSORZRxVpGU", // Password MySQL kamu
  database: "railway", // Nama database yang mau dipakai
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
