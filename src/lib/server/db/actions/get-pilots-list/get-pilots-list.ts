import { and, asc, count, eq, sql } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { flightLog } from "$lib/server/db/schema/flight-log";
import { pilot } from "$lib/server/db/schema/pilot";

interface GetPilotsListParams {
	page: number;
	pageSize: number;
	nameQuery?: string;
}

function normalizeNameQuery(value: string | undefined): string | undefined {
	const normalized = value?.trim().toLowerCase();

	return normalized || undefined;
}

export const getPilotsList = createDbAction(
	async (db, userId: string, { page, pageSize, nameQuery }: GetPilotsListParams) => {
		const normalizedNameQuery = normalizeNameQuery(nameQuery);
		const whereClauses = [eq(pilot.userId, userId)];

		if (normalizedNameQuery) {
			whereClauses.push(sql`lower(${pilot.name}) like ${`%${normalizedNameQuery}%`}`);
		}

		const whereClause = whereClauses.length === 1 ? whereClauses[0]! : and(...whereClauses)!;
		const offset = (page - 1) * pageSize;

		const pilotLogsCounts = db
			.select({
				pilotId: flightLog.pilotInCommandId,
				logsCount: count().as("logs_count"),
			})
			.from(flightLog)
			.where(eq(flightLog.userId, userId))
			.groupBy(flightLog.pilotInCommandId)
			.as("pilot_logs_counts");

		const [items, [{ totalCount }]] = await Promise.all([
			db
				.select({
					id: pilot.id,
					name: pilot.name,
					logsCount: sql<number>`coalesce(${pilotLogsCounts.logsCount}, 0)`,
				})
				.from(pilot)
				.leftJoin(pilotLogsCounts, eq(pilot.id, pilotLogsCounts.pilotId))
				.where(whereClause)
				.orderBy(asc(pilot.name))
				.limit(pageSize)
				.offset(offset),
			db.select({ totalCount: count() }).from(pilot).where(whereClause),
		]);

		return {
			items,
			totalCount,
		};
	},
);
