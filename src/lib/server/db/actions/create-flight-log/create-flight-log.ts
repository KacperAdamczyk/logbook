import type { FlightLogSchemaOutput } from "$lib/remotes/flight-log/flight-log.schema";
import { createDbAction } from "$lib/server/db/actions/createDbAction";

const createFlightLog = createDbAction(async (db, { date }: FlightLogSchemaOutput) => {
	return null;
});
