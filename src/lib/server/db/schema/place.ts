import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const place = sqliteTable("place", {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull(),
});
