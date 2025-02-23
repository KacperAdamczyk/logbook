import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const allowedUser = sqliteTable("allowedUser", {
	id: text().primaryKey().$defaultFn(v7),
	email: text().notNull().unique(),
});
