import { type Pilot, pilots } from "@/db/schema";
import { createDbAction } from "@/db/utils";

export interface CreateSelfAsPilotArgs {
	id: string;
}

export const createSelfAsPilot = createDbAction<CreateSelfAsPilotArgs, Pilot>(
	async (tx, { id }) => {
		const user = await tx.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, id),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const { name } = user;

		if (!name) {
			throw new Error("User does not have a name");
		}

		const [newPilot] = await tx
			.insert(pilots)
			.values({
				userId: id,
				name,
			})
			.returning();

		return newPilot;
	},
);
