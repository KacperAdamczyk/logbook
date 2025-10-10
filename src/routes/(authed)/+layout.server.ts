import type { LayoutServerLoad } from '../../../.svelte-kit/types/src/routes';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth';

type Session = typeof auth.$Infer.Session;

export const load: LayoutServerLoad<Session> = async ({ locals: { session, user } }) => {
	if (!session || !user) redirect(303, '/sign-in');

	return {
		session,
		user
	};
};
