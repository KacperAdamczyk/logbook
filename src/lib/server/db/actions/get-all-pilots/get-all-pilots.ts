import { createDbAction } from "$lib/server/db/actions/createDbAction";

export const getAllPilots = createDbAction((db, userId: string) => {
	return db.query.pilot.findMany({
		where: { userId },
		orderBy: {
			name: "asc",
		},
	});
});
