import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { timeToMinutes } from "@/helpers/timeToMinutes";
import { z } from "zod";

const landingsTakeoffsSchema = z.coerce
	.number()
	.int()
	.nonnegative()
	.optional()
	.transform((value) => value?.toString());
const timeSchema = z.object(
	{
		hour: z.number().int().min(0).max(23),
		minute: z.number().int().min(0).max(59),
	},
	{ message: "Must be a valid time" },
);
const optionalTimeSchema = timeSchema.nullable();

export const logFormSchema = z
	.object({
		date: z
			.date()
			.min(
				new Date("1900-01-01"),
				"Date must be greater than or equal to 1900-01-01",
			)
			.max(
				new Date("2100-01-01"),
				"Date must be smaller than or equal to 2100-01-01",
			),
		departurePlace: z.string().trim().min(1),
		departureTime: timeSchema,
		arrivalPlace: z.string().trim().min(1),
		arrivalTime: timeSchema,
		planeModel: z.string().trim().min(1),
		planeRegistration: z.string().trim().min(1),
		engineType: z.enum(["single", "multi"]),
		singlePilotTimeSingleEngine: optionalTimeSchema,
		singlePilotTimeMultiEngine: optionalTimeSchema,
		multiPilotTime: optionalTimeSchema,
		totalFlightTime: timeSchema,
		pilotInCommand: z.string().trim().min(1),
		takeoffsDay: landingsTakeoffsSchema,
		takeoffsNight: landingsTakeoffsSchema,
		landingsDay: landingsTakeoffsSchema,
		landingsNight: landingsTakeoffsSchema,
		operationalConditionTimeNight: optionalTimeSchema,
		operationalConditionTimeIfr: optionalTimeSchema,
		functionTimePilotInCommand: optionalTimeSchema,
		functionTimeCoPilot: optionalTimeSchema,
		functionTimeDual: optionalTimeSchema,
		functionTimeInstructor: optionalTimeSchema,
		remarks: z.string().max(255).optional(),
	})
	.superRefine(
		(
			{
				engineType,
				singlePilotTimeSingleEngine,
				singlePilotTimeMultiEngine,
				multiPilotTime,
				totalFlightTime,
			},
			ctx,
		) => {
			const totalFlightTimeMinutes = timeToMinutes(totalFlightTime);

			if (engineType === "single") {
				if (!singlePilotTimeSingleEngine && !singlePilotTimeMultiEngine) {
					const message = "Single engine or multi engine is required";
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeSingleEngine"],
					});
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeMultiEngine"],
					});
				}

				if (singlePilotTimeSingleEngine && singlePilotTimeMultiEngine) {
					const message =
						"Either single engine or multi engine can be filled at the same time";
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeSingleEngine"],
					});
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeMultiEngine"],
					});
				}

				const message = "Must be less or equal to Total Flight Time";
				if (
					singlePilotTimeSingleEngine &&
					totalFlightTimeMinutes < timeToMinutes(singlePilotTimeSingleEngine)
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeSingleEngine"],
					});
				}

				if (
					singlePilotTimeMultiEngine &&
					totalFlightTimeMinutes < timeToMinutes(singlePilotTimeMultiEngine)
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singleMultiEngine"],
					});
				}
			}

			if (engineType === "multi") {
				if (!multiPilotTime) {
					const message = "Multi engine is required";
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["multiPilotTime"],
					});
				}

				const message = "Must be less or equal to Total Flight Time";
				if (
					multiPilotTime &&
					totalFlightTimeMinutes < timeToMinutes(multiPilotTime)
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["multiPilotTime"],
					});
				}
			}
		},
	)
	.superRefine(
		(
			{
				departureTime,
				arrivalTime,
				totalFlightTime,
				operationalConditionTimeNight,
				operationalConditionTimeIfr,
				functionTimePilotInCommand,
				functionTimeCoPilot,
				functionTimeDual,
				functionTimeInstructor,
			},
			ctx,
		) => {
			const totalFlightTimeMinutes = timeToMinutes(totalFlightTime);
			const flightDuration = calculateFlightTime(departureTime, arrivalTime);
			if (totalFlightTimeMinutes > flightDuration) {
				const message =
					"Total flight time must less or equal to Flight Duration";
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["totalFlightTime"],
				});
			}

			const message = "Must be less or equal to Total Flight Time";
			if (
				operationalConditionTimeNight &&
				totalFlightTimeMinutes < timeToMinutes(operationalConditionTimeNight)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["operationalConditionTimeNight"],
				});
			}

			if (
				operationalConditionTimeIfr &&
				totalFlightTimeMinutes < timeToMinutes(operationalConditionTimeIfr)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["operationalConditionTimeIfr"],
				});
			}

			if (
				functionTimePilotInCommand &&
				totalFlightTimeMinutes < timeToMinutes(functionTimePilotInCommand)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimePilotInCommand"],
				});
			}

			if (
				functionTimeCoPilot &&
				totalFlightTimeMinutes < timeToMinutes(functionTimeCoPilot)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeCoPilot"],
				});
			}

			if (
				functionTimeDual &&
				totalFlightTimeMinutes < timeToMinutes(functionTimeDual)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeDual"],
				});
			}

			if (
				functionTimeInstructor &&
				totalFlightTimeMinutes < timeToMinutes(functionTimeInstructor)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeInstructor"],
				});
			}
		},
	);

export type LogFormValues = z.infer<typeof logFormSchema>;
