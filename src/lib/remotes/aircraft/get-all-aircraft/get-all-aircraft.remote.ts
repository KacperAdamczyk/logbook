import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getAllAircraft as getAllAircraftAction } from "$lib/server/db/actions/get-all-aircraft/get-all-aircraft";

export const getAllAircraft = query(async () => {
	const { user } = await getUser();

	return getAllAircraftAction(db, user.id);
});
