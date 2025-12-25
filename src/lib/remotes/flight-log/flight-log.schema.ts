import { z } from "zod";

const timeSchema = z.stringFormat("time", /^(?:[01]\d|2[0-3])[0-5]\d$/);

export const flightLogSchema = z.object({
	date: z.iso.date(),
	departurePlace: z.string().length(4),
	departureTime: timeSchema,
	arrivalPlace: z.string().length(4),
	arrivalTime: timeSchema,
});

export type FlightLogSchema = z.infer<typeof flightLogSchema>;
