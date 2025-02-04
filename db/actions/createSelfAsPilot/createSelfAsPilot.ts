import { type Pilot, pilot } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface CreateSelfAsPilotArgs {
	userId: string;
}

const DEFAULT_PILOT_NAME = "Self";

export const createSelfAsPilot = createDbAction<CreateSelfAsPilotArgs, Pilot>(
	async (tx, { userId }) => {
		const userFound = await tx.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		});

		if (!userFound) {
			throw new Error("User not found");
		}

		const [newPilot] = await tx
			.insert(pilot)
			.values({
				userId,
				name: DEFAULT_PILOT_NAME,
			})
			.returning();

		return newPilot;
	},
);
