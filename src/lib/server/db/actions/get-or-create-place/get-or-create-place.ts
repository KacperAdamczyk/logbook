import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { place } from "$lib/server/db/schema";

export const getOrCreatePlace = createDbAction(async (db, userId: string, name: string) => {
	const uppercaseName = name.toUpperCase();

	const existingPlace = await db.query.place.findFirst({
		where: { userId, name: uppercaseName },
	});

	if (existingPlace) {
		return existingPlace;
	}

	const [newPlace] = await db.insert(place).values({ userId, name: uppercaseName }).returning();

	return newPlace;
});
