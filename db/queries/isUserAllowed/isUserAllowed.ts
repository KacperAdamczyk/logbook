import { createDbAction } from "@/db/utils";

export interface IsUserAllowedArgs {
	email: string;
}

export const isUserAllowed = createDbAction<IsUserAllowedArgs, boolean>(
	async (tx, { email }) => {
		const allowedUser = await tx.query.allowedUser.findFirst({
			where: (allowedUser, { eq }) => eq(allowedUser.email, email),
		});

		return !!allowedUser;
	},
);
