import { eq, desc } from "drizzle-orm";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { log } from "$lib/server/db/schema/log";

export const getLogs = createDbAction((db, userId: string) => {
	return db.select().from(log).where(eq(log.userId, userId)).orderBy(desc(log.date));
});
