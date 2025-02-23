import { type Place, place } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface GetOrCreatePlaceArgs {
	userId: string;
	name: string;
}

export const getOrCreatePlace = createDbAction<GetOrCreatePlaceArgs, Place>(
	async (tx, { userId, name }) => {
		const placeFound = await tx.query.place.findFirst({
			where: (place, { and, eq }) =>
				and(eq(place.userId, userId), eq(place.name, name)),
		});

		if (placeFound) {
			return placeFound;
		}

		const [newPlace] = await tx
			.insert(place)
			.values({
				userId,
				name,
			})
			.returning();

		return newPlace;
	},
);
