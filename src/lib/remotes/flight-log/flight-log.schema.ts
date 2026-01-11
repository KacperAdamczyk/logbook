import { parseDuration } from "$lib/utils/parse-duration";
import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";

const timeSchema = z.stringFormat("time", /^(?:[01]\d|2[0-3])[0-5]\d$/);
const durationSchema = z.stringFormat("duration", /^\d\d[0-5]\d$/).transform(parseDuration);
const optionalDurationSchema = z.union([
	durationSchema,
	z.literal("").transform(() => Temporal.Duration.from({ minutes: 0 })),
]);

export const flightLogSchema = z.object({
	date: z.iso.date(),
	departurePlace: z.string().length(4),
	departureTime: timeSchema,
	arrivalPlace: z.string().length(4),
	arrivalTime: timeSchema,
	// Aircraft
	aircraftModel: z.string().min(1),
	aircraftRegistration: z.string().min(1),
	// Pilot
	pilotInCommandName: z.string().min(1),
	// Flight time details
	totalFlightTime: durationSchema,
	singlePilotSingleEngineTime: optionalDurationSchema,
	singlePilotMultiEngineTime: optionalDurationSchema,
	multiPilotTime: optionalDurationSchema,
	operationalConditionNightTime: optionalDurationSchema,
	operationalConditionIfrTime: optionalDurationSchema,
	functionPilotInCommandTime: optionalDurationSchema,
	functionCoPilotTime: optionalDurationSchema,
	functionDualTime: optionalDurationSchema,
	functionInstructorTime: optionalDurationSchema,
	// Additional details
	takeoffsDay: z.number().int().min(0).optional(),
	takeoffsNight: z.number().int().min(0).optional(),
	landingsDay: z.number().int().min(0).optional(),
	landingsNight: z.number().int().min(0).optional(),
	remarks: z.string().optional(),
});

export type FlightLogSchemaInput = z.input<typeof flightLogSchema>;
export type FlightLogSchemaOutput = z.output<typeof flightLogSchema>;
