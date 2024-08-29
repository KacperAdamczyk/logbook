import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { formatMinutes } from "@/helpers/formatMinutes";
import { formatToMinutes } from "@/helpers/formatToMinutes";
import { CalendarDate, parseTime } from "@internationalized/date";
import { z } from "zod";

export const logFormSchema = z
	.object({
		date: z.coerce
			.date()
			.min(
				new Date("1900-01-01"),
				"Date must be greater than or equal to 1900-01-01",
			)
			.max(
				new Date("2100-01-01"),
				"Date must be smaller than or equal to 2100-01-01",
			)
			.transform((date) =>
				new CalendarDate(
					date.getUTCFullYear(),
					date.getUTCMonth() + 1,
					date.getUTCDate(),
				).toString(),
			),
		departurePlace: z.string().trim().min(1),
		departureTime: z.string().trim().min(1).time(),
		arrivalPlace: z.string().trim().min(1),
		arrivalTime: z.string().trim().min(1).time(),
		planeModel: z.string().trim().min(1),
		planeRegistration: z.string().trim().min(1),
		engineType: z.enum(["single", "multi"]),
		singlePilotTimeSingleEngine: z.string().trim().time().optional(),
		singlePilotTimeMultiEngine: z.string().trim().time().optional(),
		multiPilotTime: z.string().trim().time().optional(),
		totalFlightTime: z.string().trim().time().min(1),
		pilotInCommand: z.string().trim().min(1),
		takeoffsDay: z.coerce.number().int().min(0).optional(),
		takeoffsNight: z.coerce.number().int().min(0).optional(),
		landingsDay: z.coerce.number().int().min(0).optional(),
		landingsNight: z.coerce.number().int().min(0).optional(),
		operationalConditionTimeNight: z.string().trim().min(1).optional(),
		operationalConditionTimeIfr: z.string().trim().min(1).optional(),
		functionTimePilotInCommand: z.string().trim().min(1).optional(),
		functionTimeCoPilot: z.string().trim().min(1).optional(),
		functionTimeDual: z.string().trim().min(1).optional(),
		functionTimeInstructor: z.string().trim().min(1).optional(),
		remarks: z.string().trim().min(1).optional(),
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
			const totalFlightTimeMinutes = formatToMinutes(totalFlightTime);

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
					totalFlightTimeMinutes < formatToMinutes(singlePilotTimeSingleEngine)
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message,
						path: ["singlePilotTimeSingleEngine"],
					});
				}

				if (
					singlePilotTimeMultiEngine &&
					totalFlightTimeMinutes < formatToMinutes(singlePilotTimeMultiEngine)
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
					totalFlightTimeMinutes < formatToMinutes(multiPilotTime)
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
			const totalFlightTimeMinutes = formatToMinutes(totalFlightTime);
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
				totalFlightTimeMinutes < formatToMinutes(operationalConditionTimeNight)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["operationalConditionTimeNight"],
				});
			}

			if (
				operationalConditionTimeIfr &&
				totalFlightTimeMinutes < formatToMinutes(operationalConditionTimeIfr)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["operationalConditionTimeIfr"],
				});
			}

			if (
				functionTimePilotInCommand &&
				totalFlightTimeMinutes < formatToMinutes(functionTimePilotInCommand)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimePilotInCommand"],
				});
			}

			if (
				functionTimeCoPilot &&
				totalFlightTimeMinutes < formatToMinutes(functionTimeCoPilot)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeCoPilot"],
				});
			}

			if (
				functionTimeDual &&
				totalFlightTimeMinutes < formatToMinutes(functionTimeDual)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeDual"],
				});
			}

			if (
				functionTimeInstructor &&
				totalFlightTimeMinutes < formatToMinutes(functionTimeInstructor)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message,
					path: ["functionTimeInstructor"],
				});
			}
		},
	);

type LogFormValues = z.infer<typeof logFormSchema>;
