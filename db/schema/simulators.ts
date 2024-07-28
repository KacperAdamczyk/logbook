import { pgTable, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const simulators = pgTable("simulator", {
	id: text("id").primaryKey().$defaultFn(v7),
});
