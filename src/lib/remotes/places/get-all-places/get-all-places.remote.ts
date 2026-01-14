import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getAllPlaces as getAllPlacesAction } from "$lib/server/db/actions/get-all-places/get-all-places";

export const getAllPlaces = query(async () => {
	const { user } = await getUser();

	return getAllPlacesAction(db, user.id);
});
