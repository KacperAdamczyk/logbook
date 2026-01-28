import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { log } from "$lib/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const getAllLogs = createDbAction((db, userId: string) => {
	return db.select().from(log).where(eq(log.userId, userId)).orderBy(desc(log.date));
});
