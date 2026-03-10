import { query } from "$app/server";
import { z } from "zod";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getPilotsList as getPilotsListAction } from "$lib/server/db/actions/get-pilots-list/get-pilots-list";

const getPilotsListSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
	nameQuery: z.string().trim().min(1).optional(),
});

export const getPilotsList = query(getPilotsListSchema, async ({ page, pageSize, nameQuery }) => {
	const { user } = await getUser();

	return getPilotsListAction(db, user.id, {
		page,
		pageSize,
		nameQuery,
	});
});
