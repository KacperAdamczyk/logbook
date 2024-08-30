import type { Aircraft } from "@/db/schema";
import { createDbAction } from "@/db/utils";

interface GetUserAircraftArgs {
	userId: string;
}

export const getUserAircraft = createDbAction<GetUserAircraftArgs, Aircraft[]>(
	(tx, { userId }) => {
		return tx.query.aircraft.findMany({
			where: (aircraft, { eq }) => eq(aircraft.userId, userId),
		});
	},
);
