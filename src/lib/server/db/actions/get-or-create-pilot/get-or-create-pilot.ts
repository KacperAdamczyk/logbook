import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { pilot } from "$lib/server/db/schema";

export const getOrCreatePilot = createDbAction(async (db, userId: string, name: string) => {
	const uppercaseName = name.toLocaleUpperCase();

	const existingPilot = await db.query.pilot.findFirst({
		where: { userId, name: uppercaseName },
	});

	if (existingPilot) {
		return existingPilot;
	}

	const [newPilot] = await db.insert(pilot).values({ userId, name: uppercaseName }).returning();

	return newPilot;
});
