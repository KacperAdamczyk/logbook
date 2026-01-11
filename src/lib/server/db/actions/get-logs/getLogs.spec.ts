import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";
import { userTest, createTestFlightLog } from "$test/fixtures";
import * as schema from "$lib/server/db/schema";

userTest("returns logs from other users (excludes own logs)", async ({ db, testUser, expect }) => {
	// Get another user
	const users = await db.query.user.findMany({ limit: 2 });
	if (users.length < 2) throw new Error("Need at least 2 test users");
	const otherUser = users.find((u) => u.id !== testUser.id)!;

	// Create deps for both users
	const [ownAircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N11111", model: "Cessna 172" })
		.returning();
	const [ownPilot] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Own Pilot" })
		.returning();
	const [ownPlace] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "KJFK" })
		.returning();

	const [otherAircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: otherUser.id, registration: "N22222", model: "Piper PA-28" })
		.returning();
	const [otherPilot] = await db
		.insert(schema.pilot)
		.values({ userId: otherUser.id, name: "Other Pilot" })
		.returning();
	const [otherPlace] = await db
		.insert(schema.place)
		.values({ userId: otherUser.id, name: "KLAX" })
		.returning();

	// Create own flight log
	await createTestFlightLog(
		db,
		testUser.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T11:00:00Z"),
		{
			aircraftId: ownAircraft.id,
			pilotId: ownPilot.id,
			placeId: ownPlace.id,
		},
	);

	// Create other user's flight log
	await createTestFlightLog(
		db,
		otherUser.id,
		new Date("2024-01-01T12:00:00Z"),
		new Date("2024-01-01T13:00:00Z"),
		{
			aircraftId: otherAircraft.id,
			pilotId: otherPilot.id,
			placeId: otherPlace.id,
		},
	);

	// getLogs returns logs from OTHER users (not the specified user)
	const logs = await getLogs(db, testUser.id);

	// Should not contain any of testUser's logs
	const ownLogs = logs.filter((log) => log.userId === testUser.id);
	expect(ownLogs).toHaveLength(0);

	// Should contain at least the other user's log we created
	const otherUserLogs = logs.filter((log) => log.userId === otherUser.id);
	expect(otherUserLogs.length).toBeGreaterThanOrEqual(1);
});
