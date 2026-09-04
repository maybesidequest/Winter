import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

let pool: pg.Pool | null = null;

export function getWinterPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.WINTER_DATABASE_URL;

    if (!connectionString) {
      throw new Error("WINTER_DATABASE_URL environment variable is required");
    }

    pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export const db = drizzle(getWinterPool());
