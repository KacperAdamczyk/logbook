import { createDbAction } from "$lib/server/db/actions/createDbAction";

export const getLogs = createDbAction((db, userId: string) => {
	return db.query.flightLog.findMany({
		where: { userId: { ne: userId } },
	});
});
