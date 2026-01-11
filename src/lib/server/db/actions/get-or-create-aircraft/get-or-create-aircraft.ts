import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { aircraft } from "$lib/server/db/schema";

export const getOrCreateAircraft = createDbAction(
	async (db, userId: string, registration: string, model: string) => {
		const existingAircraft = await db.query.aircraft.findFirst({
			where: { userId, model, registration },
		});

		if (existingAircraft) {
			return existingAircraft;
		}

		const aircraftWithSameRegistration = await db.query.aircraft.findFirst({
			where: { userId, registration },
		});

		if (aircraftWithSameRegistration) {
			throw new Error("An aircraft with the same registration already exists.");
		}

		const [newAircraft] = await db
			.insert(aircraft)
			.values({ userId, registration, model })
			.returning();

		return newAircraft;
	},
);
