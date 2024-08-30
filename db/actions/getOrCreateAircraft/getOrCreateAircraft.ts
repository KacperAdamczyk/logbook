import { type Aircraft, aircraft } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface GetOrCreateAircraftArgs {
	userId: string;
	model: string;
	registration: string;
}

export const getOrCreateAircraft = createDbAction<
	GetOrCreateAircraftArgs,
	Aircraft
>(async (tx, { userId, model, registration }) => {
	const existingAircraft = await tx.query.aircraft.findFirst({
		where: (aircraft, { and, eq }) =>
			and(
				eq(aircraft.userId, userId),
				eq(aircraft.model, model),
				eq(aircraft.registration, registration),
			),
	});

	if (existingAircraft) {
		return existingAircraft;
	}

	const [newAircraft] = await tx
		.insert(aircraft)
		.values({
			userId,
			model,
			registration,
		})
		.returning();

	return newAircraft;
});
