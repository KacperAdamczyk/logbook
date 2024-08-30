"use server";

import { actionClient } from "@/actions/safe-action";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { getFlightDates } from "@/helpers/getFlightDates";

export const createLogAction = actionClient
	.schema(logFormSchema)
	.action(async ({ parsedInput, ctx: { user } }) => {
		const [departure, arrival] = getFlightDates(
			parsedInput.date,
			parsedInput.departureTime,
			parsedInput.arrivalTime,
		);

		console.log(user, parsedInput);
	});
