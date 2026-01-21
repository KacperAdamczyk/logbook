import { getOrCreateAircraft } from "$lib/server/db/actions/get-or-create-aircraft";
import { userTest } from "$test/fixtures";

userTest("creates a new aircraft if one does not exist", async ({ db, testUser, expect }) => {
	const registration = "N12345";
	const model = "Cessna 172";
	const aircraftBefore = await db.query.aircraft.findMany({
		where: { userId: testUser.id },
	});

	const aircraft = await getOrCreateAircraft(db, testUser.id, model, registration);
	const aircraftAfter = await db.query.aircraft.findMany({
		where: { userId: testUser.id },
	});

	expect(aircraft.registration).toBe(registration.toUpperCase());
	expect(aircraft.model).toBe(model.toUpperCase());
	expect(aircraftAfter).toHaveLength(aircraftBefore.length + 1);
});

userTest("returns existing aircraft if one already exists", async ({ db, testUser, expect }) => {
	const registration = "N67890";
	const model = "Piper PA-28";

	const firstAircraft = await getOrCreateAircraft(db, testUser.id, model, registration);
	const secondAircraft = await getOrCreateAircraft(db, testUser.id, model, registration);

	expect(firstAircraft.id).toBe(secondAircraft.id);
	expect(firstAircraft.registration).toBe(registration.toUpperCase());
});

userTest(
	"throws error when registration already exists with a different model",
	async ({ db, testUser, expect }) => {
		const registration = "N11111";

		await getOrCreateAircraft(db, testUser.id, "Cessna 172", registration);

		await expect(getOrCreateAircraft(db, testUser.id, "Piper PA-28", registration)).rejects.toThrow(
			"An aircraft with the same registration already exists.",
		);
	},
);
