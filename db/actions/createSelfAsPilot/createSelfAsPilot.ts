import { type Pilot, pilots } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface CreateSelfAsPilotArgs {
	userId: string;
}

const DEFAULT_PILOT_NAME = "Self";

export const createSelfAsPilot = createDbAction<CreateSelfAsPilotArgs, Pilot>(
	async (tx, { userId }) => {
		const user = await tx.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const [newPilot] = await tx
			.insert(pilots)
			.values({
				userId,
				name: DEFAULT_PILOT_NAME,
			})
			.returning();

		return newPilot;
	},
);
