import { pilots, type Pilot } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface GetOrCreatePilotArgs {
    userId: string;
    name: string;
}

export const getOrCreatePilot = createDbAction<GetOrCreatePilotArgs, Pilot>(async (tx, {userId, name}) => {
    const pilot = await tx.query.pilots.findFirst({
        where: (pilots, { and, eq }) => and(
            eq(pilots.userId, userId),
            eq(pilots.name, name),
        )   
    })

    if (pilot) {
        return pilot;
    }

    const [newPilot] = await tx.insert(pilots).values({
        userId,
        name,
    }).returning();

    return newPilot;
})
