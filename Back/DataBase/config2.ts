import * as mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "axio_user",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "axio",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});