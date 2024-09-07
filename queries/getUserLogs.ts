import { db } from "@/db";
import { TAGS } from "@/queries/tags";
import { unstable_cache } from "next/cache";

export const getUserLogs = async (userId: string) =>
	db.query.logs.findMany({
		where: (logs, { eq }) => eq(logs.userId, userId),
		orderBy: (logs, { asc }) => [asc(logs.departureAt)],
		with: {
			aircraft: true,
			pilotInCommand: true,
			singularTimes: true,
		},
	});

export const getUserLogsQuery = unstable_cache(getUserLogs, ["getUserLogs"], {
	tags: [TAGS.logs],
});
