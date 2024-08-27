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
		),
});
