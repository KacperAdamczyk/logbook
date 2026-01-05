import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pilot = sqliteTable("pilot", {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull(),
});
