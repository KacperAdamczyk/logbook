import { and, count, desc, eq, gte, lt } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { log } from "$lib/server/db/schema/log";
import type { LogsListFilters } from "$lib/utils/logs-filters";

interface GetLogsParams {
	page: number;
	pageSize: number;
	filters?: LogsListFilters;
}

function parseUtcDateStart(isoDate: string): Date {
	return new Date(`${isoDate}T00:00:00.000Z`);
}

function addDaysUtc(date: Date, days: number): Date {
	return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export const getLogs = createDbAction(
	async (db, userId: string, { page, pageSize, filters }: GetLogsParams) => {
		const whereClauses = [eq(log.userId, userId)];

		if (filters?.dateFrom) {
			whereClauses.push(gte(log.date, parseUtcDateStart(filters.dateFrom)));
		}

		if (filters?.dateTo) {
			whereClauses.push(lt(log.date, addDaysUtc(parseUtcDateStart(filters.dateTo), 1)));
		}

		if (filters?.departurePlaceId) {
			whereClauses.push(eq(log.departurePlaceId, filters.departurePlaceId));
		}

		if (filters?.arrivalPlaceId) {
			whereClauses.push(eq(log.arrivalPlaceId, filters.arrivalPlaceId));
		}

		if (filters?.pilotInCommandId) {
			whereClauses.push(eq(log.pilotInCommandId, filters.pilotInCommandId));
		}

		if (filters?.aircraftId) {
			whereClauses.push(eq(log.aircraftId, filters.aircraftId));
		}

		const whereClause = whereClauses.length === 1 ? whereClauses[0]! : and(...whereClauses)!;
		const offset = (page - 1) * pageSize;

		const [items, [{ totalCount }]] = await Promise.all([
			db
				.select()
				.from(log)
				.where(whereClause)
				.orderBy(desc(log.date))
				.limit(pageSize)
				.offset(offset),
			db.select({ totalCount: count() }).from(log).where(whereClause),
		]);

		return {
			items,
			totalCount,
		};
	},
);
