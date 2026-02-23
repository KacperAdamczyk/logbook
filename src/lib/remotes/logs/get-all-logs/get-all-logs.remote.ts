import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";
import { z } from "zod";

const getAllLogsSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
});

export const getAllLogs = query(getAllLogsSchema, async ({ page, pageSize }) => {
	const { user } = await getUser();

	return getLogs(db, user.id, { page, pageSize });
});
