import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const getUserId = async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	const userId = session?.user?.id;
	if (!userId) {
		notFound();
	}

	return userId;
};
