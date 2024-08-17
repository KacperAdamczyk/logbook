import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { env } from "@/env";
import { beforeAll, beforeEach, vi } from "vitest";
import * as schema from "@/db/schema";

const sqlite = new Database(env.DATABASE_URL);
const testDb = drizzle(sqlite, { schema });

vi.mock("@/db", () => ({ db: testDb }));

beforeEach(() => {
	migrate(testDb, { migrationsFolder: "./drizzle" });
});
