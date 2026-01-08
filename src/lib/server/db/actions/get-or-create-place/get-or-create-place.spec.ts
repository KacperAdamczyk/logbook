import { getOrCreatePlace } from "$lib/server/db/actions/get-or-create-place";
import { dbTest } from "$test/fixtures";
import { describe, expect } from "vitest";

describe("getOrCreatePlace", () => {
	dbTest("creates a new place if it does not exist", async ({ tx }) => {
		const testUser = await tx.query.user.findFirst();

		if (!testUser) throw new Error("Test user not found");

		const placeName = "Test Place";
		const placesBefore = await tx.query.place.findMany({
			where: { userId: testUser.id },
		});

		const foundPlace = await getOrCreatePlace(tx, testUser.id, placeName);
		const placesAfter = await tx.query.place.findMany({
			where: { userId: testUser.id },
		});

		expect(foundPlace.name).toBe(placeName);
		expect(placesAfter).toHaveLength(placesBefore.length + 1);
	});
});
