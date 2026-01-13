import { resolve } from "$app/paths";
import { form } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { flightLogSchema } from "$lib/remotes/flight-log/flight-log.schema";
import { db } from "$lib/server/db";
import { createFlightLog as createFlightLogAction } from "$lib/server/db/actions/create-flight-log";
import { invalid, redirect } from "@sveltejs/kit";

export const createFlightLog = form(flightLogSchema, async (data, issue) => {
	const { user } = await getUser();

	try {
		const { id } = await createFlightLogAction(db, user.id, data);

		redirect(303, resolve(`/logs/flights/${id}`));
	} catch (error) {
		if (error instanceof Error) {
			invalid(issue(error.message));
		}

		throw error;
	}
});
