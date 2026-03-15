import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/get-user/get-user.remote";
import { db } from "$lib/server/db";
import { getAllPilots as getAllPilotsAction } from "$lib/server/db/actions/get-all-pilots/get-all-pilots";

export const getAllPilots = query(async () => {
	const { user } = await getUser();

	return getAllPilotsAction(db, user.id);
});
