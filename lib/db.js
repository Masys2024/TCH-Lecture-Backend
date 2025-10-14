import mysql from "mysql2/promise";

// Create a MySQL connection pool
export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "tch_1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
