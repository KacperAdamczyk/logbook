import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const pilots = sqliteTable("pilot", {
	id: text("id").primaryKey().$defaultFn(v7),
	name: text("name").notNull(),
});
