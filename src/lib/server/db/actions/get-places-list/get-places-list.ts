import { and, asc, count, eq, sql } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { flightLog } from "$lib/server/db/schema/flight-log";
import { place } from "$lib/server/db/schema/place";

interface GetPlacesListParams {
	page: number;
	pageSize: number;
	nameQuery?: string;
}

function normalizeNameQuery(value: string | undefined): string | undefined {
	const normalized = value?.trim().toLowerCase();

	return normalized || undefined;
}

export const getPlacesList = createDbAction(
	async (db, userId: string, { page, pageSize, nameQuery }: GetPlacesListParams) => {
		const normalizedNameQuery = normalizeNameQuery(nameQuery);
		const whereClauses = [eq(place.userId, userId)];

		if (normalizedNameQuery) {
			whereClauses.push(sql`lower(${place.name}) like ${`%${normalizedNameQuery}%`}`);
		}

		const whereClause = whereClauses.length === 1 ? whereClauses[0]! : and(...whereClauses)!;
		const offset = (page - 1) * pageSize;

		const departureCounts = db
			.select({
				placeId: flightLog.departurePlaceId,
				departuresCount: sql<number>`count(*)`.as("departures_count"),
			})
			.from(flightLog)
			.where(eq(flightLog.userId, userId))
			.groupBy(flightLog.departurePlaceId)
			.as("departure_counts");

		const arrivalCounts = db
			.select({
				placeId: flightLog.arrivalPlaceId,
				arrivalsCount: sql<number>`count(*)`.as("arrivals_count"),
			})
			.from(flightLog)
			.where(eq(flightLog.userId, userId))
			.groupBy(flightLog.arrivalPlaceId)
			.as("arrival_counts");

		const [items, [{ totalCount }]] = await Promise.all([
			db
				.select({
					id: place.id,
					name: place.name,
					arrivalsCount: sql<number>`coalesce(${arrivalCounts.arrivalsCount}, 0)`,
					departuresCount: sql<number>`coalesce(${departureCounts.departuresCount}, 0)`,
					totalCount: sql<number>`coalesce(${arrivalCounts.arrivalsCount}, 0) + coalesce(${departureCounts.departuresCount}, 0)`,
				})
				.from(place)
				.leftJoin(departureCounts, eq(place.id, departureCounts.placeId))
				.leftJoin(arrivalCounts, eq(place.id, arrivalCounts.placeId))
				.where(whereClause)
				.orderBy(asc(place.name))
				.limit(pageSize)
				.offset(offset),
			db.select({ totalCount: count() }).from(place).where(whereClause),
		]);

		return {
			items,
			totalCount,
		};
	},
);
