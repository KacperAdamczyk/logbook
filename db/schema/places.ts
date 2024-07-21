import { pgTable, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const places = pgTable("place", {
	id: text("id").primaryKey().$defaultFn(v7),
});
