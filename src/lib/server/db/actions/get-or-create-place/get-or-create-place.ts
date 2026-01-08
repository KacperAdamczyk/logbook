import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { place } from "$lib/server/db/schema";

export const getOrCreatePlace = createDbAction(async (db, userId: string, name: string) => {
	const existingPlace = await db.query.place.findFirst({
		where: { userId, name },
	});

	if (existingPlace) {
		return existingPlace;
	}

	const [newPlace] = await db.insert(place).values({ userId, name }).returning();

	return newPlace;
});
