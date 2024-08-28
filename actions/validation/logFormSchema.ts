import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const logFormSchema = z.object({
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
});

type LogFormValues = z.infer<typeof logFormSchema>;
