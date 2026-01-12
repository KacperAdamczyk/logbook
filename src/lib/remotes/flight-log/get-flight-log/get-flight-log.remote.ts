import { query } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { db } from "$lib/server/db";
import { getFlightLog as getFlightLogAction } from "$lib/server/db/actions/get-flight-log/get-flight-log";
import { error } from "@sveltejs/kit";
import { z } from "zod";

const getFlightLogSchema = z.string();

export const getFlightLog = query(getFlightLogSchema, async (id) => {
	const { user } = await getUser();

	const flightLog = await getFlightLogAction(db, user.id, id);

	if (!flightLog) {
		error(404, "Flight log not found");
	}

	return flightLog;
});
