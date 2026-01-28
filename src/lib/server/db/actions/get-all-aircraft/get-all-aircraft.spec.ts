import { getAllAircraft } from "$lib/server/db/actions/get-all-aircraft/get-all-aircraft";
import * as schema from "$lib/server/db/schema";
import { userTest } from "$test/fixtures";

userTest("returns empty array when user has no aircraft", async ({ db, testUser, expect }) => {
	const aircraft = await getAllAircraft(db, testUser.id);

	expect(aircraft).toHaveLength(0);
});

userTest(
	"returns only user's aircraft (not other users' aircraft)",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((u) => u.id !== testUser.id)!;

		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N12345", model: "CESSNA 172" })
			.returning();
		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N67890", model: "PIPER PA-28" })
			.returning();
		await db
			.insert(schema.aircraft)
			.values({ userId: otherUser.id, registration: "N99999", model: "CIRRUS SR22" })
			.returning();

		const aircraft = await getAllAircraft(db, testUser.id);

		expect(aircraft).toHaveLength(2);
		expect(aircraft.every((ac) => ac.userId === testUser.id)).toBe(true);
		expect(aircraft.find((ac) => ac.registration === "N99999")).toBeUndefined();
	},
);

userTest("returns all aircraft sorted by registration", async ({ db, testUser, expect }) => {
	await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N67890", model: "PIPER PA-28" })
		.returning();
	await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N12345", model: "CESSNA 172" })
		.returning();
	await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N99999", model: "CIRRUS SR22" })
		.returning();

	const aircraft = await getAllAircraft(db, testUser.id);

	expect(aircraft).toHaveLength(3);
	expect(aircraft[0].registration).toBe("N12345");
	expect(aircraft[1].registration).toBe("N67890");
	expect(aircraft[2].registration).toBe("N99999");
});
