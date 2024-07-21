import { pgTable, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const pilots = pgTable("pilot", {
	id: text("id").primaryKey().$defaultFn(v7),
	name: text("name").notNull(),
});
