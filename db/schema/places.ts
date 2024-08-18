import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const places = sqliteTable("place", {
	id: text("id").primaryKey().$defaultFn(v7),
	name: text("name").notNull(),
});
