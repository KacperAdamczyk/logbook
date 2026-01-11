import { findOverlappingLogs } from "$lib/server/db/actions/find-overlapping-logs";
import { flightLogTest, createTestFlightLog, dbTest } from "$test/fixtures";
import * as schema from "$lib/server/db/schema";
import { Temporal } from "@js-temporal/polyfill";

flightLogTest(
	"returns empty array when no overlapping logs exist",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 11:00
		await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T11:00:00Z"),
			deps,
		);

		// Check for overlap: 12:00 - 13:00 (no overlap)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T12:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T13:00:00"),
		});

		expect(overlaps).toHaveLength(0);
	},
);

flightLogTest(
	"detects overlap when new log starts during existing log",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 12:00
		const existingLog = await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T12:00:00Z"),
			deps,
		);

		// Check for overlap: 11:00 - 13:00 (starts during existing)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T13:00:00"),
		});

		expect(overlaps).toHaveLength(1);
		expect(overlaps[0].id).toBe(existingLog.id);
	},
);

flightLogTest(
	"detects overlap when new log ends during existing log",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 12:00
		const existingLog = await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T12:00:00Z"),
			deps,
		);

		// Check for overlap: 09:00 - 11:00 (ends during existing)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T09:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
		});

		expect(overlaps).toHaveLength(1);
		expect(overlaps[0].id).toBe(existingLog.id);
	},
);

flightLogTest(
	"detects overlap when new log completely contains existing log",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 11:00
		const existingLog = await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T11:00:00Z"),
			deps,
		);

		// Check for overlap: 09:00 - 12:00 (contains existing)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T09:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T12:00:00"),
		});

		expect(overlaps).toHaveLength(1);
		expect(overlaps[0].id).toBe(existingLog.id);
	},
);

flightLogTest(
	"detects overlap when new log is contained within existing log",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 09:00 - 12:00
		const existingLog = await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T09:00:00Z"),
			new Date("2024-01-01T12:00:00Z"),
			deps,
		);

		// Check for overlap: 10:00 - 11:00 (within existing)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T10:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
		});

		expect(overlaps).toHaveLength(1);
		expect(overlaps[0].id).toBe(existingLog.id);
	},
);

flightLogTest(
	"does not detect overlap for adjacent logs",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 11:00
		await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T11:00:00Z"),
			deps,
		);

		// Check for overlap: 11:00 - 12:00 (adjacent, no overlap)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T12:00:00"),
		});

		expect(overlaps).toHaveLength(0);
	},
);

dbTest("only returns logs for the specified user", async ({ db, expect }) => {
	// Create deps for both users
	const users = await db.query.user.findMany({ limit: 2 });
	if (users.length < 2) throw new Error("Need at least 2 test users");
	const [user1, user2] = users;

	const [aircraft1] = await db
		.insert(schema.aircraft)
		.values({ userId: user1.id, registration: "N11111", model: "Cessna 172" })
		.returning();
	const [pilot1] = await db
		.insert(schema.pilot)
		.values({ userId: user1.id, name: "Pilot 1" })
		.returning();
	const [place1] = await db
		.insert(schema.place)
		.values({ userId: user1.id, name: "KJFK" })
		.returning();

	const [aircraft2] = await db
		.insert(schema.aircraft)
		.values({ userId: user2.id, registration: "N22222", model: "Piper PA-28" })
		.returning();
	const [pilot2] = await db
		.insert(schema.pilot)
		.values({ userId: user2.id, name: "Pilot 2" })
		.returning();
	const [place2] = await db
		.insert(schema.place)
		.values({ userId: user2.id, name: "KLAX" })
		.returning();

	// User 1's log: 10:00 - 12:00
	await createTestFlightLog(
		db,
		user1.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T12:00:00Z"),
		{
			aircraftId: aircraft1.id,
			pilotId: pilot1.id,
			placeId: place1.id,
		},
	);

	// User 2's log: 10:00 - 12:00 (same time, different user)
	await createTestFlightLog(
		db,
		user2.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T12:00:00Z"),
		{
			aircraftId: aircraft2.id,
			pilotId: pilot2.id,
			placeId: place2.id,
		},
	);

	// Check for User 1's overlaps only
	const overlaps = await findOverlappingLogs(db, {
		userId: user1.id,
		departureAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
		arrivalAt: Temporal.PlainDateTime.from("2024-01-01T13:00:00"),
	});

	expect(overlaps).toHaveLength(1);
	expect(overlaps[0].userId).toBe(user1.id);
});

flightLogTest(
	"excludes specified log ID when provided (for updates)",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Existing log: 10:00 - 12:00
		const existingLog = await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:00:00Z"),
			new Date("2024-01-01T12:00:00Z"),
			deps,
		);

		// Check for overlap with same time range, but excluding the log itself
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T10:00:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T12:00:00"),
			excludeLogId: existingLog.id,
		});

		expect(overlaps).toHaveLength(0);
	},
);

flightLogTest(
	"returns multiple overlapping logs when they exist",
	async ({ db, testUser, testAircraft, testPilot, testPlace, expect }) => {
		const deps = { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };

		// Log 1: 09:00 - 10:00
		await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T09:00:00Z"),
			new Date("2024-01-01T10:00:00Z"),
			deps,
		);

		// Log 2: 10:30 - 11:30
		await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T10:30:00Z"),
			new Date("2024-01-01T11:30:00Z"),
			deps,
		);

		// Log 3: 12:00 - 13:00
		await createTestFlightLog(
			db,
			testUser.id,
			new Date("2024-01-01T12:00:00Z"),
			new Date("2024-01-01T13:00:00Z"),
			deps,
		);

		// Check for overlap: 09:30 - 11:00 (overlaps with logs 1 and 2)
		const overlaps = await findOverlappingLogs(db, {
			userId: testUser.id,
			departureAt: Temporal.PlainDateTime.from("2024-01-01T09:30:00"),
			arrivalAt: Temporal.PlainDateTime.from("2024-01-01T11:00:00"),
		});

		expect(overlaps).toHaveLength(2);
	},
);
