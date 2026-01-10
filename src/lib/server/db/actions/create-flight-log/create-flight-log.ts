import type { FlightLogSchemaOutput } from "$lib/remotes/flight-log/flight-log.schema";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { Temporal } from "@js-temporal/polyfill";

const createFlightLog = createDbAction(
	async (db, { date, arrivalTime, departureTime }: FlightLogSchemaOutput) => {
		const arrivalDate = Temporal.PlainDateTime.from(date).withPlainTime(arrivalTime);
		const departureDate = Temporal.PlainDateTime.from(date).withPlainTime(departureTime);

		return null;
	},
);
