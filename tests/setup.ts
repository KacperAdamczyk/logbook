import { db } from "@/db";
import { aircraft, logs, pilots, places, simulators, users } from "@/db/schema";
import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeAll, beforeEach } from "vitest";

beforeAll(async () => {
	console.log("Preparing test database...");

	await migrate(db, { migrationsFolder: "./drizzle" });
});

beforeEach(async () => {
	console.log("Clearing test database...");

	const tables = [users, aircraft, logs, pilots, places, simulators] as const;

	await Promise.all(tables.map((table) => db.delete(table)));
});
