import { db } from "@/db";
import { pilots, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createSelfAsPilot = async (id: string) => {
	const user = await db.query.users.findFirst({ where: eq(users.id, id) });

	if (!user) {
		throw new Error("User not found");
	}

	const { name } = user;

	if (!name) {
		throw new Error("User does not have a name");
	}

	return db.insert(pilots).values({
		userId: id,
		name,
	});
};
