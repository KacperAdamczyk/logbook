import { test } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { seed } from "drizzle-seed";
import * as schema from "$lib/server/db/schema";
import { relations } from "$lib/server/db/schema/relations";
import type { DB } from "$lib/server/db";

/**
 * Base database test fixture.
 * Creates a fresh in-memory database for each test with migrations and seed data.
 */
export const dbTest = test.extend<{ db: DB }>({
	// eslint-disable-next-line no-empty-pattern
	db: async ({}, use) => {
		const db = drizzle({ connection: { url: ":memory:" }, schema, relations });
		await migrate(db, { migrationsFolder: "drizzle" });
		await seed(db, schema);

		await use(db);
	},
});

/**
 * Database test fixture with a test user pre-selected.
 */
export const userTest = dbTest.extend<{
	testUser: typeof schema.user.$inferSelect;
}>({
	testUser: async ({ db }, use) => {
		const user = await db.query.user.findFirst();
		if (!user) throw new Error("No test user found");
		await use(user);
	},
});

/**
 * Database test fixture with flight log dependencies (aircraft, pilot, place).
 */
export const flightLogTest = userTest.extend<{
	testAircraft: typeof schema.aircraft.$inferSelect;
	testPilot: typeof schema.pilot.$inferSelect;
	testPlace: typeof schema.place.$inferSelect;
}>({
	testAircraft: async ({ db, testUser }, use) => {
		const [aircraft] = await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N12345", model: "Cessna 172" })
			.returning();
		await use(aircraft);
	},
	testPilot: async ({ db, testUser }, use) => {
		const [pilot] = await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "Test Pilot" })
			.returning();
		await use(pilot);
	},
	testPlace: async ({ db, testUser }, use) => {
		const [place] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "KJFK" })
			.returning();
		await use(place);
	},
});

/**
 * Test utility to create a flight log.
 */
export async function createTestFlightLog(
	db: DB,
	userId: string,
	departureAt: Date,
	arrivalAt: Date,
	deps: { aircraftId: string; pilotId: string; placeId: string },
) {
	const [log] = await db
		.insert(schema.flightLog)
		.values({
			userId,
			departureAt,
			arrivalAt,
			departurePlaceId: deps.placeId,
			arrivalPlaceId: deps.placeId,
			aircraftId: deps.aircraftId,
			pilotInCommandId: deps.pilotId,
			totalFlightTime: 60,
			singlePilotTime: 60,
			multiPilotTime: 0,
			operationalConditionNightTime: 0,
			operationalConditionIfrTime: 0,
			functionPilotInCommandTime: 60,
			functionCoPilotTime: 0,
			functionDualTime: 0,
			functionInstructorTime: 0,
		})
		.returning();
	return log;
}
