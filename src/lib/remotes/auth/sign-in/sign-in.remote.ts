import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { signInSchema } from "$lib/remotes/auth/sign-in/sign-in.schema";
import { redirect, invalid } from "@sveltejs/kit";
import { APIError } from "better-auth";

export const signIn = form(signInSchema, async ({ email, _password: password }, issue) => {
	try {
		const { request } = getRequestEvent();

		await auth.api.signInEmail({
			body: { email, password },
			request,
			headers: request.headers,
		});

		redirect(303, resolve("/"));
	} catch (error) {
		if (error instanceof APIError) {
			invalid(issue(error.message));
		}

		throw error;
	}
});
