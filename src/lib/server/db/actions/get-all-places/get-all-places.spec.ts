import { getAllPlaces } from "$lib/server/db/actions/get-all-places/get-all-places";
import * as schema from "$lib/server/db/schema";
import { userTest } from "$test/fixtures";

userTest("returns empty array when user has no places", async ({ db, testUser, expect }) => {
	const places = await getAllPlaces(db, testUser.id);

	expect(places).toHaveLength(0);
});

userTest(
	"returns only user's places (not other users' places)",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((u) => u.id !== testUser.id)!;

		await db.insert(schema.place).values({ userId: testUser.id, name: "KJFK" }).returning();
		await db.insert(schema.place).values({ userId: testUser.id, name: "KLAX" }).returning();
		await db.insert(schema.place).values({ userId: otherUser.id, name: "KORD" }).returning();

		const places = await getAllPlaces(db, testUser.id);

		expect(places).toHaveLength(2);
		expect(places.every((place) => place.userId === testUser.id)).toBe(true);
		expect(places.find((place) => place.name === "KORD")).toBeUndefined();
	},
);

userTest("returns all places sorted by name", async ({ db, testUser, expect }) => {
	await db.insert(schema.place).values({ userId: testUser.id, name: "KLAX" }).returning();
	await db.insert(schema.place).values({ userId: testUser.id, name: "KJFK" }).returning();
	await db.insert(schema.place).values({ userId: testUser.id, name: "KORD" }).returning();

	const places = await getAllPlaces(db, testUser.id);

	expect(places).toHaveLength(3);
	expect(places[0].name).toBe("KJFK");
	expect(places[1].name).toBe("KLAX");
	expect(places[2].name).toBe("KORD");
});
