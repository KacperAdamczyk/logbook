import { z } from 'zod';

export const flightLogSchema = z.object({
	// date: z.iso.date(),
	// departureTime: z.string(),
	// arrivalTime: z.string()
});

export type FlightLogSchema = z.infer<typeof flightLogSchema>;
