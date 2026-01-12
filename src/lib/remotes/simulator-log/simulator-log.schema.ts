import { parseDuration } from "$lib/utils/parse-duration";
import { z } from "zod";

const durationSchema = z.stringFormat("duration", /^\d\d[0-5]\d$/).transform(parseDuration);

export const simulatorLogSchema = z.object({
	date: z.iso.date(),
	type: z.string().min(1),
	totalTime: durationSchema,
});

export type SimulatorLogSchemaInput = z.input<typeof simulatorLogSchema>;
export type SimulatorLogSchemaOutput = z.output<typeof simulatorLogSchema>;
