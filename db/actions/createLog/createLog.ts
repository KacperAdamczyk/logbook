import { db } from "@/db";
import { createDbAction } from "@/db/utils";

export const createLog = createDbAction(async (user, {}) => {
	const users = await db.query.users.findMany();

	console.log(users);
});
