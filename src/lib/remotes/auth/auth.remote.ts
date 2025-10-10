import { resolve } from '$app/paths';
import { form, getRequestEvent } from '$app/server';
import { auth } from '$lib/auth';
import { signInSchema, signUpSchema } from '$lib/remotes/auth/auth.schema';
import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';
import { z } from 'zod';

export const signUp = form(signUpSchema, async ({ name, email, _password: password }, invalid) => {
	try {
		const { request } = getRequestEvent();

		await auth.api.signUpEmail({
			body: { name, email, password },
			request,
			headers: request.headers
		});

		redirect(303, resolve('/sign-in'));
	} catch (error) {
		if (error instanceof APIError) {
			invalid(error.message);
		}

		throw error;
	}
});

export const signIn = form(signInSchema, async ({ email, _password: password }, invalid) => {
	try {
		const { request } = getRequestEvent();

		await auth.api.signInEmail({
			body: { email, password },
			request,
			headers: request.headers
		});

		redirect(303, resolve('/'));
	} catch (error) {
		if (error instanceof APIError) {
			invalid(error.message);
		}

		throw error;
	}
});

export const signOut = form(z.object(), async () => {
	const { request } = getRequestEvent();

	await auth.api.signOut({
		request,
		headers: request.headers
	});

	redirect(303, resolve('/sign-in'));
});
