import type { Log } from "@/db/schema/log";
import { createDbAction } from "@/db/utils";

export interface GetOverlappingLogsArgs {
	userId: string;
	departure: Date;
	arrival: Date;
	logId?: string;
}

export const getOverlappingLogs = createDbAction<GetOverlappingLogsArgs, Log[]>(
	async (tx, { userId, logId, departure, arrival }) =>
		tx.query.log.findMany({
			where: (log, { and, lt, gt, eq, ne }) =>
				and(
					eq(log.userId, userId),
					logId ? ne(log.id, logId) : undefined,
					lt(log.departureAt, arrival),
					gt(log.arrivalAt, departure),
				),
		}),
);
