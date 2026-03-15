import { query } from "$app/server";
import { z } from "zod";
import { getUser } from "$lib/remotes/auth/get-user/get-user.remote";
import { db } from "$lib/server/db";
import { getAircraftList as getAircraftListAction } from "$lib/server/db/actions/get-aircraft-list/get-aircraft-list";

const getAircraftListSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
	nameQuery: z.string().trim().min(1).optional(),
});

export const getAircraftList = query(
	getAircraftListSchema,
	async ({ page, pageSize, nameQuery }) => {
		const { user } = await getUser();

		return getAircraftListAction(db, user.id, {
			page,
			pageSize,
			nameQuery,
		});
	},
);
