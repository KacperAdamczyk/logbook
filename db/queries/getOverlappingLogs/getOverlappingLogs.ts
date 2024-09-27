import type { Log } from "@/db/schema/logs";
import { createDbAction } from "@/db/utils";

export interface GetOverlappingLogsArgs {
	userId: string;
	departure: Date;
	arrival: Date;
	logId?: string;
}

export const getOverlappingLogs = createDbAction<GetOverlappingLogsArgs, Log[]>(
	async (tx, { userId, logId, departure, arrival }) =>
		tx.query.logs.findMany({
			where: (logs, { and, lt, gt, eq, ne }) =>
				and(
					eq(logs.userId, userId),
					logId ? ne(logs.id, logId) : undefined,
					lt(logs.departureAt, arrival),
					gt(logs.arrivalAt, departure),
				),
		}),
);
