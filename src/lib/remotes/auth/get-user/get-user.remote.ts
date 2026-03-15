import { resolve } from "$app/paths";
import { query, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";

export const getUser = query(async () => {
	const { request } = getRequestEvent();

	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		redirect(303, resolve("/sign-in"));
	}

	return session;
});
