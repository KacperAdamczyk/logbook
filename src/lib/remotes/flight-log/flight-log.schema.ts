import { z } from 'zod';

const timeSchema = z.stringFormat('time', /^(?:[01]\d|2[0-3])[0-5]\d$/);
const durationSchema = z.stringFormat('duration', /^\d\d[0-5]\d$/);

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
	singlePilotType: z.enum(['single', 'multi']).optional(),
	singlePilotTime: durationSchema.optional(),
	multiPilotTime: durationSchema.optional(),
	operationalConditionNightTime: durationSchema.optional(),
	operationalConditionIfrTime: durationSchema.optional(),
	functionPilotInCommandTime: durationSchema.optional(),
	functionCoPilotTime: durationSchema.optional(),
	functionDualTime: durationSchema.optional(),
	functionInstructorTime: durationSchema.optional(),
	// Additional details
	takeoffsDay: z.number().int().min(0).optional(),
	takeoffsNight: z.number().int().min(0).optional(),
	landingsDay: z.number().int().min(0).optional(),
	landingsNight: z.number().int().min(0).optional(),
	remarks: z.string().optional()
});

export type FlightLogSchema = z.infer<typeof flightLogSchema>;
