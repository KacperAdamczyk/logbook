import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";
import { userTest, createTestFlightLog } from "$test/fixtures";
import * as schema from "$lib/server/db/schema";

userTest("returns logs for the specified user", async ({ db, testUser, expect }) => {
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

	// getLogs returns logs for the specified user only
	const result = await getLogs(db, testUser.id, { page: 1, pageSize: 50 });
	const logs = result.items;

	// Should contain only testUser's logs
	const ownLogs = logs.filter((log) => log.userId === testUser.id);
	expect(ownLogs.length).toBeGreaterThanOrEqual(1);

	// Should not contain other user's logs
	const otherUserLogs = logs.filter((log) => log.userId === otherUser.id);
	expect(otherUserLogs).toHaveLength(0);
	expect(result.totalCount).toBe(ownLogs.length);
});

userTest(
	"applies page and pageSize while returning totalCount",
	async ({ db, testUser, expect }) => {
		const [aircraft] = await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N33333", model: "Cessna 172" })
			.returning();
		const [pilot] = await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "Pagination Pilot" })
			.returning();
		const [place] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "KSEA" })
			.returning();

		for (let day = 1; day <= 3; day++) {
			await createTestFlightLog(
				db,
				testUser.id,
				new Date(`2024-01-0${day}T10:00:00Z`),
				new Date(`2024-01-0${day}T11:00:00Z`),
				{
					aircraftId: aircraft.id,
					pilotId: pilot.id,
					placeId: place.id,
				},
			);
		}

		const pageOne = await getLogs(db, testUser.id, { page: 1, pageSize: 2 });
		const pageTwo = await getLogs(db, testUser.id, { page: 2, pageSize: 2 });

		expect(pageOne.items).toHaveLength(2);
		expect(pageTwo.totalCount).toBe(pageOne.totalCount);
		expect(pageOne.totalCount).toBe(3);
		expect(pageOne.items[0]?.date.getTime()).toBeGreaterThan(pageOne.items[1]?.date.getTime() ?? 0);
		expect(pageTwo.items).toHaveLength(1);
		expect(pageOne.items.map((log) => log.id)).not.toContain(pageTwo.items[0]?.id);
		expect(pageOne.items[1]?.date.getTime()).toBeGreaterThan(pageTwo.items[0]?.date.getTime() ?? 0);
	},
);
