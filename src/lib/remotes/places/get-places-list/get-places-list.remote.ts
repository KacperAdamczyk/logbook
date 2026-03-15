import { query } from "$app/server";
import { z } from "zod";
import { getUser } from "$lib/remotes/auth/get-user/get-user.remote";
import { db } from "$lib/server/db";
import { getPlacesList as getPlacesListAction } from "$lib/server/db/actions/get-places-list/get-places-list";

const getPlacesListSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
	nameQuery: z.string().trim().min(1).optional(),
});

export const getPlacesList = query(getPlacesListSchema, async ({ page, pageSize, nameQuery }) => {
	const { user } = await getUser();

	return getPlacesListAction(db, user.id, {
		page,
		pageSize,
		nameQuery,
	});
});
