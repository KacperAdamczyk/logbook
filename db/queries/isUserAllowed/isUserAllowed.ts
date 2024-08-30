import { createDbAction } from "@/db/utils";

export interface IsUserAllowedArgs {
  email: string;
}

export const isUserAllowed = createDbAction<IsUserAllowedArgs, boolean>(
  async (tx, { email }) => {
    const allowedUser = await tx.query.allowedUsers.findFirst({
      where: (allowedUsers, { eq }) => eq(allowedUsers.email, email),
    });

    return !!allowedUser;
  }
);
