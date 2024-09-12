"use server";
import { actionClient } from "@/actions/safe-action";
import { recalculateLogs } from "@/db/actions/recalculateLogs";
import { z } from "zod";

export const recalculateLogsAction = actionClient
	.schema(z.void())
	.action(async ({ ctx: { userId } }) => {
		const recalculatedLogs = await recalculateLogs({
			userId,
			since: new Date(0),
		});

		return { recalculatedLogsCount: recalculatedLogs.length };
	});
