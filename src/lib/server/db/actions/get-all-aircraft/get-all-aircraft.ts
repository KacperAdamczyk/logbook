import { createDbAction } from "$lib/server/db/actions/createDbAction";

export const getAllAircraft = createDbAction((db, userId: string) => {
	return db.query.aircraft.findMany({
		where: { userId },
		orderBy: {
			registration: "asc",
		},
	});
});
