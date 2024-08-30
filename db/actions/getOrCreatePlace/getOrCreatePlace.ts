import { places, type Place } from "@/db/schema";
import { createDbAction } from "@/db/utils";
import { and, eq } from "drizzle-orm";

export interface GetOrCreatePlaceArgs {
    userId: string;
    name: string;
}

export const getOrCreatePlace = createDbAction<GetOrCreatePlaceArgs, Place>(async (tx, {userId, name}) => {
    const place = await tx.query.places.findFirst({
        where: and(
            eq(places.userId, userId),
            eq(places.name, name),
        )   
    })

    if (place) {
        return place;
    }

    const [newPlace] = await tx.insert(places).values({
        userId,
        name,
    }).returning();

    return newPlace;
})