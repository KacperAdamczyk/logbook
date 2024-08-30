import type { Pilot } from "@/db/schema";
import { createDbAction } from "@/db/utils";

interface GetUserPilotsArgs {
	userId: string;
}

export const getUserPilots = createDbAction<GetUserPilotsArgs, Pilot[]>(
	(tx, { userId }) => {
		return tx.query.pilots.findMany({
			where: (pilots, { eq }) => eq(pilots.userId, userId),
		});
	},
);
