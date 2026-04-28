import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ FATAL ERROR: DATABASE_URL is not defined in environment.");
  process.exit(1);
}

const pool = mysql.createPool({
  uri: dbUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
