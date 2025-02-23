import { type Time, time } from "@/db/schema";
import { createDbAction } from "@/db/utils";
import { eq } from "drizzle-orm";

const defaultTimes = {
	totalFlight: 0,
	singlePilotSingleEngine: 0,
	singlePilotMultiEngine: 0,
	multiPilot: 0,
	operationalConditionNight: 0,
	operationalConditionIfr: 0,
	functionPilotInCommand: 0,
	functionCoPilot: 0,
	functionDual: 0,
	functionInstructor: 0,
} satisfies Omit<Time, "id">;

interface RecalculateLogsArgs {
	userId: string;
	since: Date;
}

export const recalculateLogs = createDbAction<RecalculateLogsArgs, Time[]>(
	async (tx, { userId, since }) => {
		const logsToUpdate = await tx.query.log.findMany({
			where: (log, { eq, gte, and }) =>
				and(eq(log.userId, userId), gte(log.departureAt, since)),
			orderBy: (log, { asc }) => [asc(log.departureAt)],
			with: {
				singularTimes: true,
				cumulatedTimes: true,
			},
		});

		const startLog = await tx.query.log.findFirst({
			where: (log, { eq, lte, and }) =>
				and(eq(log.userId, userId), lte(log.arrivalAt, since)),
			orderBy: (log, { desc }) => [desc(log.arrivalAt)],
			with: {
				cumulatedTimes: true,
			},
		});

		const updatedTimes: Time[] = [];
		let lastTimes = startLog?.cumulatedTimes ?? defaultTimes;

		for (const { singularTimes, cumulatedTimes } of logsToUpdate) {
			const updatedTimeValues = {
				totalFlight: lastTimes.totalFlight + singularTimes.totalFlight,
				singlePilotSingleEngine:
					lastTimes.singlePilotSingleEngine +
					singularTimes.singlePilotSingleEngine,
				singlePilotMultiEngine:
					lastTimes.singlePilotMultiEngine +
					singularTimes.singlePilotMultiEngine,
				multiPilot: lastTimes.multiPilot + singularTimes.multiPilot,
				operationalConditionNight:
					lastTimes.operationalConditionNight +
					singularTimes.operationalConditionNight,
				operationalConditionIfr:
					lastTimes.operationalConditionIfr +
					singularTimes.operationalConditionIfr,
				functionPilotInCommand:
					lastTimes.functionPilotInCommand +
					singularTimes.functionPilotInCommand,
				functionCoPilot:
					lastTimes.functionCoPilot + singularTimes.functionCoPilot,
				functionDual: lastTimes.functionDual + singularTimes.functionDual,
				functionInstructor:
					lastTimes.functionInstructor + singularTimes.functionInstructor,
			} satisfies Omit<Time, "id">;

			const [updatedTime] = await tx
				.update(time)
				.set(updatedTimeValues)
				.where(eq(time.id, cumulatedTimes.id))
				.returning();

			lastTimes = updatedTime;
			updatedTimes.push(updatedTime);
		}

		return updatedTimes;
	},
);
