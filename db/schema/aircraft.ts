import { pgTable, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const aircraft = pgTable("aircraft", {
	id: text("id").primaryKey().$defaultFn(v7),
	model: text("model").notNull(),
	registration: text("registration").notNull(),
});
