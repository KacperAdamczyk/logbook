import { getOrCreateAircraft } from "$lib/server/db/actions/get-or-create-aircraft";
import { dbTest } from "$test/fixtures";
import { describe, expect } from "vitest";

describe("getOrCreateAircraft", () => {
	dbTest("creates a new aircraft if it does not exist", async ({ tx }) => {
		const testUser = await tx.query.user.findFirst();

		if (!testUser) throw new Error("Test user not found");

		const registration = "N12345";
		const model = "Cessna 172";
		const aircraftBefore = await tx.query.aircraft.findMany({
			where: { userId: testUser.id },
		});

		const foundAircraft = await getOrCreateAircraft(tx, testUser.id, registration, model);
		const aircraftAfter = await tx.query.aircraft.findMany({
			where: { userId: testUser.id },
		});

		expect(foundAircraft.registration).toBe(registration);
		expect(foundAircraft.model).toBe(model);
		expect(aircraftAfter).toHaveLength(aircraftBefore.length + 1);
	});
});
