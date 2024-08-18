import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const aircraft = sqliteTable("aircraft", {
	id: text("id").primaryKey().$defaultFn(v7),
	model: text("model").notNull(),
	registration: text("registration").notNull(),
});
