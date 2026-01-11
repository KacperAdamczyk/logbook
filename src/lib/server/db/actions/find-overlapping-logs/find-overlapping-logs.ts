import { createDbAction } from "$lib/server/db/actions/createDbAction";
import type { Temporal } from "@js-temporal/polyfill";

interface FindOverlappingLogsArgs {
	userId: string;
	departureAt: Temporal.ZonedDateTime;
	arrivalAt: Temporal.ZonedDateTime;
	excludeLogId?: string;
}

export const findOverlappingLogs = createDbAction(
	async (db, { userId, departureAt, arrivalAt, excludeLogId }: FindOverlappingLogsArgs) =>
		db.query.flightLog.findMany({
			where: {
				userId,
				departureAt: { lt: new Date(arrivalAt.toInstant().epochMilliseconds) },
				arrivalAt: { gt: new Date(departureAt.toInstant().epochMilliseconds) },
				...(excludeLogId ? { id: { ne: excludeLogId } } : {}),
			},
		}),
);
