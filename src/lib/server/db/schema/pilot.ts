import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const pilot = sqliteTable(
	"pilot",
	{
		...commonFields,
		userId: text()
			.notNull()
			.references(() => user.id),
		name: text().notNull(),
	},
	(t) => [uniqueIndex("pilot_user_name_idx").on(t.userId, t.name)],
);
