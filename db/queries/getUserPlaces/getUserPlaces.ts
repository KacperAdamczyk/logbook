import type { Place } from "@/db/schema";
import { createDbAction } from "@/db/utils";

interface GetUserPlacesArgs {
	userId: string;
}

export const getUserPlaces = createDbAction<GetUserPlacesArgs, Place[]>(
	(tx, { userId }) => {
		return tx.query.place.findMany({
			where: (place, { eq }) => eq(place.userId, userId),
		});
	},
);
