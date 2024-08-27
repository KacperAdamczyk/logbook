import { parseTime } from "@internationalized/date";
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
			),
		departurePlace: z.string().trim().min(1),
		departureTime: z.string().trim().min(1).time(),
		arrivalPlace: z.string().trim().min(1),
		arrivalTime: z.string().trim().min(1).time(),
	})
	.refine(
		({ departureTime, arrivalTime }) => {
			try {
				return parseTime(departureTime).compare(parseTime(arrivalTime)) < 0;
			} catch {
				return false;
			}
		},
		{
			message: "Arrival Time must be after Departure Time",
			path: ["arrivalTime"],
		},
	);
