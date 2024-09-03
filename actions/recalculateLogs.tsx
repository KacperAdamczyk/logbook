"use server";
import { actionClient } from "@/actions/safe-action";
import { recalculateLogs } from "@/db/actions/recalculateLogs";

export const recalculateLogsAction = actionClient.action(
	async ({ ctx: { userId } }) => {
		const recalculatedLogs = await recalculateLogs({
			userId,
			since: new Date(0),
		});

		return { recalculatedLogsCount: recalculatedLogs.length };
	},
);
