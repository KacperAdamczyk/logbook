import { getOrCreatePilot } from "$lib/server/db/actions/get-or-create-pilot";
import { userTest } from "$test/fixtures";

userTest("creates a new pilot if one does not exist", async ({ db, testUser, expect }) => {
	const pilotName = "John Doe";
	const pilotsBefore = await db.query.pilot.findMany({
		where: { userId: testUser.id },
	});

	const pilot = await getOrCreatePilot(db, testUser.id, pilotName);
	const pilotsAfter = await db.query.pilot.findMany({
		where: { userId: testUser.id },
	});

	expect(pilot.name).toBe(pilotName);
	expect(pilotsAfter).toHaveLength(pilotsBefore.length + 1);
});

userTest("returns existing pilot if one already exists", async ({ db, testUser, expect }) => {
	const pilotName = "Jane Doe";

	const firstPilot = await getOrCreatePilot(db, testUser.id, pilotName);
	const secondPilot = await getOrCreatePilot(db, testUser.id, pilotName);

	expect(firstPilot.id).toBe(secondPilot.id);
	expect(firstPilot.name).toBe(pilotName);
});
