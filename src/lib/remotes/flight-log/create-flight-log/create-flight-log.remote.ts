import { form } from '$app/server';
import { flightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';

export const createFlightLog = form(flightLogSchema, async (data) => {
	console.log('data', data);
});
