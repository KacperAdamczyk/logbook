import { resolve } from "$app/paths";
import { form } from "$app/server";
import { getUser } from "$lib/remotes/auth/auth.remote";
import { simulatorLogSchema } from "$lib/remotes/simulator-log/simulator-log.schema";
import { db } from "$lib/server/db";
import { createSimulatorLog as createSimulatorLogAction } from "$lib/server/db/actions/create-simulator-log";
import { invalid, redirect } from "@sveltejs/kit";

export const createSimulatorLog = form(simulatorLogSchema, async (data, issue) => {
	const { user } = await getUser();

	try {
		await createSimulatorLogAction(db, user.id, data);

		redirect(303, resolve("/"));
	} catch (error) {
		if (error instanceof Error) {
			invalid(issue(error.message));
		}

		throw error;
	}
});
