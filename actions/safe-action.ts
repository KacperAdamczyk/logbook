import { auth } from "@/auth";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
    const session = await auth();

    if (!session) {
      throw new Error("Session not found!");
    }


    if (!session.user) {
      throw new Error("Session is not valid!");
    }

    return next({ ctx: { user: session.user } });
  });;