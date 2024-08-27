import { createDbAction } from "@/db/utils";

export const createLog = createDbAction(async (tx, params) => {
	const users = await tx.query.users.findMany();

	// check overlapping

	// recalculate values

	return users;
});
