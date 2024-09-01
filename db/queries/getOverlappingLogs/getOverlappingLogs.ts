import type { Log } from "@/db/schema/logs";
import { createDbAction } from "@/db/utils";

export interface GetOverlappingLogsArgs {
	userId: string;
	departure: Date;
	arrival: Date;
}

export const getOverlappingLogs = createDbAction<GetOverlappingLogsArgs, Log[]>(
	async (tx, { userId, departure, arrival }) =>
		tx.query.logs.findMany({
			where: (logs, { and, lt, gt, eq }) =>
				and(
					eq(logs.userId, userId),
					lt(logs.departureAt, arrival),
					gt(logs.arrivalAt, departure),
				),
		}),
);
