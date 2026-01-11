import { getOrCreatePlace } from "$lib/server/db/actions/get-or-create-place";
import { userTest } from "$test/fixtures";

userTest("creates a new place if one does not exist", async ({ db, testUser, expect }) => {
	const placeName = "KJFK";
	const placesBefore = await db.query.place.findMany({
		where: { userId: testUser.id },
	});

	const place = await getOrCreatePlace(db, testUser.id, placeName);
	const placesAfter = await db.query.place.findMany({
		where: { userId: testUser.id },
	});

	expect(place.name).toBe(placeName);
	expect(placesAfter).toHaveLength(placesBefore.length + 1);
});

userTest("returns existing place if one already exists", async ({ db, testUser, expect }) => {
	const placeName = "KLAX";

	const firstPlace = await getOrCreatePlace(db, testUser.id, placeName);
	const secondPlace = await getOrCreatePlace(db, testUser.id, placeName);

	expect(firstPlace.id).toBe(secondPlace.id);
	expect(firstPlace.name).toBe(placeName);
});
