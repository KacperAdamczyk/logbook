import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";
import { z } from "zod";

const logsListFiltersSchema = z.object({
	dateFrom: z.iso.date().optional(),
	dateTo: z.iso.date().optional(),
	departurePlaceId: z.string().min(1).optional(),
	arrivalPlaceId: z.string().min(1).optional(),
	pilotInCommandId: z.string().min(1).optional(),
	aircraftId: z.string().min(1).optional(),
});

const getAllLogsSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
	filters: logsListFiltersSchema.optional(),
});

export const getAllLogs = query(getAllLogsSchema, async ({ page, pageSize, filters }) => {
	const { user } = await getUser();

	return getLogs(db, user.id, {
		page,
		pageSize,
		filters,
	});
});
