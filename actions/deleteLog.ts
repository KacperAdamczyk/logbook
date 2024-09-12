"use server";
import { actionClient } from "@/actions/safe-action";
import { db } from "@/db";
import { recalculateLogs } from "@/db/actions/recalculateLogs";
import { logs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const deleteLogSchema = z.object({
	logId: z.string().uuid(),
});

export const deleteLogAction = actionClient
	.schema(deleteLogSchema)
	.action(async ({ ctx: { userId }, parsedInput: { logId } }) =>
		db.transaction(async (tx) => {
			const [deletedLog] = await tx
				.delete(logs)
				.where(and(eq(logs.userId, userId), eq(logs.id, logId)))
				.returning();

			const recalculatedLogs = await recalculateLogs(
				{
					userId,
					since: new Date(deletedLog.departureAt),
				},
				tx,
			);

			return { recalculatedLogsCount: recalculatedLogs.length };
		}),
	);
