import { createDbAction } from "$lib/server/db/actions/createDbAction";

export const getAllPlaces = createDbAction((db, userId: string) => {
	return db.query.place.findMany({
		where: { userId },
		orderBy: {
			name: "asc",
		},
	});
});
