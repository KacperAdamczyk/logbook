import { db } from "@/db";
import { aircraft, log, pilot, place, time, user } from "@/db/schema";
import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeEach } from "vitest";

beforeEach(async () => {
	console.log("Preparing test database🛢️", process.env.DATABASE_URL);

	await migrate(db, { migrationsFolder: "./drizzle" });
	await db.batch([
		db.delete(log),
		db.delete(aircraft),
		db.delete(pilot),
		db.delete(place),
		db.delete(user),
		db.delete(time),
	]);
});
