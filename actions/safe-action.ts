import { auth } from "@/lib/auth";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error("Session not found!");
	}

	const { user } = session;

	if (!user || !user.id) {
		throw new Error("Session is not valid!");
	}

	return next({ ctx: { userId: user.id } });
});
