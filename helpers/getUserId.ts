import { auth } from "@/auth";
import { notFound } from "next/navigation";

export const getUserId = async () => {
	const session = await auth();

	const userId = session?.user?.id;
	if (!userId) {
		notFound();
	}

	return userId;
};
