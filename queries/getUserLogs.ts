import { db } from "@/db";

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
