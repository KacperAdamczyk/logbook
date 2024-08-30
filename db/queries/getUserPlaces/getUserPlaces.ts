import type { Place } from "@/db/schema";
import { createDbAction } from "@/db/utils";

interface GetUserPlacesArgs {
	userId: string;
}

export const getUserPlaces = createDbAction<GetUserPlacesArgs, Place[]>(
	(tx, { userId }) => {
		return tx.query.places.findMany({
			where: (places, { eq }) => eq(places.userId, userId),
		});
	},
);
