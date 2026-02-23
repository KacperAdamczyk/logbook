import { count, desc, eq } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { log } from "$lib/server/db/schema/log";

interface GetLogsParams {
	page: number;
	pageSize: number;
}

export const getLogs = createDbAction(
	async (db, userId: string, { page, pageSize }: GetLogsParams) => {
		const whereClause = eq(log.userId, userId);
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
