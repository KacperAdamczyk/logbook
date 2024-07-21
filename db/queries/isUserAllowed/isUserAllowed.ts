import { db } from "@/db";
import { allowedUsers } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export const isUserAllowed = async (email: string) => {
	const allowedUser = await db.query.allowedUsers.findFirst({
		where: eq(allowedUsers.email, email),
	});

	return !!allowedUser;
};
