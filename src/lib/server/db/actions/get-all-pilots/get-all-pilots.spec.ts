import { getAllPilots } from "$lib/server/db/actions/get-all-pilots/get-all-pilots";
import * as schema from "$lib/server/db/schema";
import { userTest } from "$test/fixtures";

userTest("returns empty array when user has no pilots", async ({ db, testUser, expect }) => {
	const pilots = await getAllPilots(db, testUser.id);

	expect(pilots).toHaveLength(0);
});

userTest(
	"returns only user's pilots (not other users' pilots)",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((u) => u.id !== testUser.id)!;

		await db.insert(schema.pilot).values({ userId: testUser.id, name: "JOHN DOE" }).returning();
		await db.insert(schema.pilot).values({ userId: testUser.id, name: "JANE SMITH" }).returning();
		await db.insert(schema.pilot).values({ userId: otherUser.id, name: "BOB JONES" }).returning();

		const pilots = await getAllPilots(db, testUser.id);

		expect(pilots).toHaveLength(2);
		expect(pilots.every((pilot) => pilot.userId === testUser.id)).toBe(true);
		expect(pilots.find((pilot) => pilot.name === "BOB JONES")).toBeUndefined();
	},
);

userTest("returns all pilots sorted by name", async ({ db, testUser, expect }) => {
	await db.insert(schema.pilot).values({ userId: testUser.id, name: "JANE SMITH" }).returning();
	await db.insert(schema.pilot).values({ userId: testUser.id, name: "JOHN DOE" }).returning();
	await db.insert(schema.pilot).values({ userId: testUser.id, name: "ALICE BROWN" }).returning();

	const pilots = await getAllPilots(db, testUser.id);

	expect(pilots).toHaveLength(3);
	expect(pilots[0].name).toBe("ALICE BROWN");
	expect(pilots[1].name).toBe("JANE SMITH");
	expect(pilots[2].name).toBe("JOHN DOE");
});
