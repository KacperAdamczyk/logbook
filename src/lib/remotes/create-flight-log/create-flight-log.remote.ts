import { form } from '$app/server';
import { createFlightLogSchema } from '$lib/remotes/create-flight-log/create-flight-log.schema';

export const createFlightLog = form(createFlightLogSchema, async (data) => {
	console.log('data', data);
});
