import { getOrCreatePilot } from "$lib/server/db/actions/get-or-create-pilot";
import { dbTest } from "$test/fixtures";
import { describe, expect } from "vitest";

describe("getOrCreatePilot", () => {
	dbTest("creates a new pilot if it does not exist", async ({ tx }) => {
		const testUser = await tx.query.user.findFirst();

		if (!testUser) throw new Error("Test user not found");

		const pilotName = "John Doe";
		const pilotsBefore = await tx.query.pilot.findMany({
			where: { userId: testUser.id },
		});

		const foundPilot = await getOrCreatePilot(tx, testUser.id, pilotName);
		const pilotsAfter = await tx.query.pilot.findMany({
			where: { userId: testUser.id },
		});

		expect(foundPilot.name).toBe(pilotName);
		expect(pilotsAfter).toHaveLength(pilotsBefore.length + 1);
	});
});
