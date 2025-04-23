import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let globalPool: postgres.Sql | null = null;

export async function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }

  if (!globalPool) {
    globalPool = postgres(process.env.POSTGRES_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  const db = drizzle(globalPool);

  return db;
}
