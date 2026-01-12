import type { SimulatorLogSchemaOutput } from "$lib/remotes/simulator-log/simulator-log.schema";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { simulatorLog } from "$lib/server/db/schema";
import { Temporal } from "@js-temporal/polyfill";
import { DrizzleError } from "drizzle-orm";

export const createSimulatorLog = createDbAction(
	async (db, userId: string, { date, type, totalTime }: SimulatorLogSchemaOutput) => {
		try {
			return db.transaction(async (tx) => {
				const day = Temporal.ZonedDateTime.from(`${date}[UTC]`);

				const [newSimulatorLog] = await tx
					.insert(simulatorLog)
					.values({
						userId,
						date: new Date(day.toInstant().epochMilliseconds),
						type,
						totalTime: totalTime.total("minutes"),
					})
					.returning();

				return newSimulatorLog;
			});
		} catch (error) {
			console.error("Error creating simulator log:", error);
			if (error instanceof DrizzleError) {
				console.error("DrizzleError creating simulator log:", error.message, error.cause);
			}

			throw error;
		}
	},
);
