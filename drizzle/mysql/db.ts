import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let globalPool: mysql.Pool | null = null;

export async function getDb() {
  if (!process.env.MYSQL_URL) {
    throw new Error("MYSQL_URL is not set");
  }

  if (!globalPool) {
    globalPool = mysql.createPool({
      uri: process.env.MYSQL_URL,
      connectionLimit: 10,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : undefined,
      waitForConnections: true,
      queueLimit: 0,
    });
  }

  const db = drizzle(globalPool);

  return db;
}
