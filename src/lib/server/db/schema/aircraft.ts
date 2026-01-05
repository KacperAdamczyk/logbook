import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const aircraft = sqliteTable("aircraft", {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	model: text().notNull(),
	registration: text().notNull(),
});
