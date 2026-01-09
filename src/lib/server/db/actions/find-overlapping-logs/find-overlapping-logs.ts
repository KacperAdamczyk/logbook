import { createDbAction } from "$lib/server/db/actions/createDbAction";

interface FindOverlappingLogsArgs {
	userId: string;
	departureAt: Date;
	arrivalAt: Date;
	excludeLogId?: string;
}

export const findOverlappingLogs = createDbAction(
	async (db, { userId, departureAt, arrivalAt, excludeLogId }: FindOverlappingLogsArgs) =>
		db.query.flightLog.findMany({
			where: {
				userId,
				departureAt: { lt: arrivalAt },
				arrivalAt: { gt: departureAt },
				...(excludeLogId ? { id: { ne: excludeLogId } } : {}),
			},
		}),
);
