import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { z } from "zod";

export const signOut = form(z.object(), async () => {
	const { request } = getRequestEvent();

	await auth.api.signOut({
		request,
		headers: request.headers,
	});

	redirect(303, resolve("/sign-in"));
});
