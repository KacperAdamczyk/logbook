import { createDbAction } from "$lib/server/db/actions/createDbAction";
import type { Temporal } from "@js-temporal/polyfill";

interface FindOverlappingLogsArgs {
	userId: string;
	departureAt: Temporal.PlainDateTime;
	arrivalAt: Temporal.PlainDateTime;
	excludeLogId?: string;
}

export const findOverlappingLogs = createDbAction(
	async (db, { userId, departureAt, arrivalAt, excludeLogId }: FindOverlappingLogsArgs) =>
		db.query.flightLog.findMany({
			where: {
				userId,
				departureAt: { lt: new Date(arrivalAt.toString()) },
				arrivalAt: { gt: new Date(departureAt.toString()) },
				...(excludeLogId ? { id: { ne: excludeLogId } } : {}),
			},
		}),
);
