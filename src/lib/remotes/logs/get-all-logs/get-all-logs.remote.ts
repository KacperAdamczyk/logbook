import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";

export const getAllLogs = query(async () => {
	const { user } = await getUser();

	return getLogs(db, user.id);
});
