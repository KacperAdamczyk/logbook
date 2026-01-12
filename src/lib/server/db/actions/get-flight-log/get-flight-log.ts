import { createDbAction } from "$lib/server/db/actions/createDbAction";

export const getFlightLog = createDbAction((db, userId: string, id: string) => {
	return db.query.flightLog.findFirst({
		where: { id, userId },
		with: {
			departurePlace: true,
			arrivalPlace: true,
			aircraft: true,
			pilotInCommand: true,
		},
	});
});
