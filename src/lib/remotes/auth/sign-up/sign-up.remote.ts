import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { signUpSchema } from "$lib/remotes/auth/sign-up/sign-up.schema";
import { redirect, invalid } from "@sveltejs/kit";
import { APIError } from "better-auth";

export const signUp = form(signUpSchema, async ({ name, email, _password: password }, issue) => {
	try {
		const { request } = getRequestEvent();

		await auth.api.signUpEmail({
			body: { name, email, password },
			request,
			headers: request.headers,
		});

		redirect(303, resolve("/sign-in"));
	} catch (error) {
		if (error instanceof APIError) {
			invalid(issue(error.message));
		}

		throw error;
	}
});
