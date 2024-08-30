import { db } from "@/db";
import { aircraft, logs, pilots, places, times, users } from "@/db/schema";
import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeEach } from "vitest";

beforeEach(async () => {
	console.log("Preparing test database🛢️", process.env.DATABASE_URL);

	await migrate(db, { migrationsFolder: "./drizzle" });
	await db.batch([
		db.delete(logs),
		db.delete(aircraft),
		db.delete(pilots),
		db.delete(places),
		db.delete(users),
		db.delete(times),
	]);
});
