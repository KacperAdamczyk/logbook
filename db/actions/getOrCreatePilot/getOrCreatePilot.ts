import { type Pilot, pilot } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface GetOrCreatePilotArgs {
	userId: string;
	name: string;
}

export const getOrCreatePilot = createDbAction<GetOrCreatePilotArgs, Pilot>(
	async (tx, { userId, name }) => {
		const pilotFound = await tx.query.pilot.findFirst({
			where: (pilot, { and, eq }) =>
				and(eq(pilot.userId, userId), eq(pilot.name, name)),
		});

		if (pilotFound) {
			return pilotFound;
		}

		const [newPilot] = await tx
			.insert(pilot)
			.values({
				userId,
				name,
			})
			.returning();

		return newPilot;
	},
);
