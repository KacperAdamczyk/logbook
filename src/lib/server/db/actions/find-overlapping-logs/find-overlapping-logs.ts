import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { flightLog } from "$lib/server/db/schema";
import { and, lt, gt, eq, ne } from "drizzle-orm";

interface FindOverlappingLogsArgs {
	userId: string;
	departureAt: Date;
	arrivalAt: Date;
	excludeLogId?: string;
}

export const findOverlappingLogs = createDbAction(
	async (db, { userId, departureAt, arrivalAt, excludeLogId }: FindOverlappingLogsArgs) => {
		const conditions = [
			eq(flightLog.userId, userId),
			lt(flightLog.departureAt, arrivalAt),
			gt(flightLog.arrivalAt, departureAt),
		];

		if (excludeLogId) {
			conditions.push(ne(flightLog.id, excludeLogId));
		}

		return db.select().from(flightLog).where(and(...conditions));
	},
);
