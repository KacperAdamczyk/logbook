import { db } from "@/db";

export const getUserLogs = async (userId: string) =>
	db.query.log.findMany({
		where: (log, { eq }) => eq(log.userId, userId),
		orderBy: (log, { asc }) => [asc(log.departureAt)],
		with: {
			aircraft: true,
			pilotInCommand: true,
			singularTimes: true,
		},
	});
