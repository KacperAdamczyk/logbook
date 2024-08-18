import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const simulators = sqliteTable("simulator", {
	id: text("id").primaryKey().$defaultFn(v7),
});
