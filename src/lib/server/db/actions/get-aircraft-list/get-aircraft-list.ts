import { and, asc, count, eq, or, sql } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { aircraft } from "$lib/server/db/schema/aircraft";
import { flightLog } from "$lib/server/db/schema/flight-log";

interface GetAircraftListParams {
	page: number;
	pageSize: number;
	nameQuery?: string;
}

function normalizeNameQuery(value: string | undefined): string | undefined {
	const normalized = value?.trim().toLowerCase();

	return normalized || undefined;
}

export const getAircraftList = createDbAction(
	async (db, userId: string, { page, pageSize, nameQuery }: GetAircraftListParams) => {
		const normalizedNameQuery = normalizeNameQuery(nameQuery);
		const whereClauses = [eq(aircraft.userId, userId)];

		if (normalizedNameQuery) {
			const searchPattern = `%${normalizedNameQuery}%`;
			whereClauses.push(
				or(
					sql`lower(${aircraft.model}) like ${searchPattern}`,
					sql`lower(${aircraft.registration}) like ${searchPattern}`,
				)!,
			);
		}

		const whereClause = whereClauses.length === 1 ? whereClauses[0]! : and(...whereClauses)!;
		const offset = (page - 1) * pageSize;

		const aircraftLogsCounts = db
			.select({
				aircraftId: flightLog.aircraftId,
				logsCount: count().as("logs_count"),
			})
			.from(flightLog)
			.where(eq(flightLog.userId, userId))
			.groupBy(flightLog.aircraftId)
			.as("aircraft_logs_counts");

		const [items, [{ totalCount }]] = await Promise.all([
			db
				.select({
					id: aircraft.id,
					model: aircraft.model,
					registration: aircraft.registration,
					logsCount: sql<number>`coalesce(${aircraftLogsCounts.logsCount}, 0)`,
				})
				.from(aircraft)
				.leftJoin(aircraftLogsCounts, eq(aircraft.id, aircraftLogsCounts.aircraftId))
				.where(whereClause)
				.orderBy(asc(aircraft.registration), asc(aircraft.model))
				.limit(pageSize)
				.offset(offset),
			db.select({ totalCount: count() }).from(aircraft).where(whereClause),
		]);

		return {
			items,
			totalCount,
		};
	},
);
