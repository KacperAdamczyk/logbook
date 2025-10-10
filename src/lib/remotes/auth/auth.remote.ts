import { resolve } from '$app/paths';
import { form } from '$app/server';
import { auth } from '$lib/auth';
import { signUpSchema } from '$lib/remotes/auth/auth.schema';
import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';

export const signUp = form(signUpSchema, async ({ name, email, _password: password }, invalid) => {
	try {
		await auth.api.signUpEmail({
			body: { name, email, password }
		});

		redirect(303, resolve('/sign-in'));
	} catch (error) {
		if (error instanceof APIError) {
			invalid(error.message);
		}

		throw error;
	}
});
