import { findOverlappingLogs } from "$lib/server/db/actions/find-overlapping-logs";
import { dbTest } from "$test/fixtures";
import { aircraft, flightLog, pilot, place } from "$lib/server/db/schema";
import type { TX } from "$lib/server/db";

async function setupDependencies(tx: TX, userId: string, suffix = "") {
	const [testAircraft] = await tx
		.insert(aircraft)
		.values({ userId, registration: `N12345${suffix}`, model: "Cessna 172" })
		.returning();
	const [testPilot] = await tx.insert(pilot).values({ userId, name: `Test Pilot${suffix}` }).returning();
	const [testPlace] = await tx.insert(place).values({ userId, name: `KJFK${suffix}` }).returning();
	return { aircraftId: testAircraft.id, pilotId: testPilot.id, placeId: testPlace.id };
}

async function createTestFlightLog(
	tx: TX,
	userId: string,
	departureAt: Date,
	arrivalAt: Date,
	deps: { aircraftId: string; pilotId: string; placeId: string },
) {
	const [log] = await tx
		.insert(flightLog)
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

dbTest("findOverlappingLogs correctly detects overlapping flight logs", async ({ tx, expect }) => {
	const users = await tx.query.user.findMany({ limit: 2 });
	if (users.length < 2) throw new Error("Need at least 2 test users");
	const [user1, user2] = users;

	const deps1 = await setupDependencies(tx, user1.id, "_1");
	const deps2 = await setupDependencies(tx, user2.id, "_2");

	// Test 1: Returns empty array when no overlapping logs exist
	const existingLog1 = await createTestFlightLog(
		tx,
		user1.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T11:00:00Z"),
		deps1,
	);

	const noOverlaps = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T12:00:00Z"),
		arrivalAt: new Date("2024-01-01T13:00:00Z"),
	});
	expect(noOverlaps).toHaveLength(0);

	// Test 2: Detects overlap when new log starts during existing log
	const existingLog2 = await createTestFlightLog(
		tx,
		user1.id,
		new Date("2024-01-01T14:00:00Z"),
		new Date("2024-01-01T16:00:00Z"),
		deps1,
	);

	const startsOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T15:00:00Z"),
		arrivalAt: new Date("2024-01-01T17:00:00Z"),
	});
	expect(startsOverlap).toHaveLength(1);
	expect(startsOverlap[0].id).toBe(existingLog2.id);

	// Test 3: Detects overlap when new log ends during existing log
	const endsOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T13:00:00Z"),
		arrivalAt: new Date("2024-01-01T15:00:00Z"),
	});
	expect(endsOverlap).toHaveLength(1);
	expect(endsOverlap[0].id).toBe(existingLog2.id);

	// Test 4: Detects overlap when new log completely contains existing log
	const containsOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T09:00:00Z"),
		arrivalAt: new Date("2024-01-01T12:00:00Z"),
	});
	expect(containsOverlap).toHaveLength(1);
	expect(containsOverlap[0].id).toBe(existingLog1.id);

	// Test 5: Detects overlap when new log is contained within existing log
	const withinOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T14:30:00Z"),
		arrivalAt: new Date("2024-01-01T15:30:00Z"),
	});
	expect(withinOverlap).toHaveLength(1);
	expect(withinOverlap[0].id).toBe(existingLog2.id);

	// Test 6: Does not detect overlap for adjacent logs
	const adjacentOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T11:00:00Z"),
		arrivalAt: new Date("2024-01-01T12:00:00Z"),
	});
	expect(adjacentOverlap).toHaveLength(0);

	// Test 7: Only returns logs for the specified user
	await createTestFlightLog(
		tx,
		user2.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T12:00:00Z"),
		deps2,
	);

	const user1Overlaps = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T10:30:00Z"),
		arrivalAt: new Date("2024-01-01T11:30:00Z"),
	});
	expect(user1Overlaps).toHaveLength(1);
	expect(user1Overlaps[0].userId).toBe(user1.id);

	// Test 8: Excludes specified log ID when provided (for updates)
	const excludeOverlap = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T10:00:00Z"),
		arrivalAt: new Date("2024-01-01T11:00:00Z"),
		excludeLogId: existingLog1.id,
	});
	expect(excludeOverlap).toHaveLength(0);

	// Test 9: Returns multiple overlapping logs when they exist
	const multipleOverlaps = await findOverlappingLogs(tx, {
		userId: user1.id,
		departureAt: new Date("2024-01-01T10:30:00Z"),
		arrivalAt: new Date("2024-01-01T15:00:00Z"),
	});
	expect(multipleOverlaps).toHaveLength(2);
});
