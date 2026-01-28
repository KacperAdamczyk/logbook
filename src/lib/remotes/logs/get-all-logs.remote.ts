import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getAllLogs as getAllLogsAction } from "$lib/server/db/actions/get-all-logs";

export const getAllLogs = query(async () => {
	const { user } = await getUser();

	return getAllLogsAction(db, user.id);
});
