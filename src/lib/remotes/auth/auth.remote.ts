import { resolve } from "$app/paths";
import { form, query, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { signInSchema, signUpSchema } from "$lib/remotes/auth/auth.schema";
import { redirect, invalid } from "@sveltejs/kit";
import { APIError } from "better-auth";
import { z } from "zod";

export const getUser = query(async () => {
	const { request } = getRequestEvent();

	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		redirect(303, resolve("/sign-in"));
	}

	return session;
});

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

export const signOut = form(z.object(), async () => {
	const { request } = getRequestEvent();

	await auth.api.signOut({
		request,
		headers: request.headers,
	});

	redirect(303, resolve("/sign-in"));
});
