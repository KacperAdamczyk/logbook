import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const place = sqliteTable(
	"place",
	{
		...commonFields,
		userId: text()
			.notNull()
			.references(() => user.id),
		name: text().notNull(),
	},
	(t) => [uniqueIndex("place_user_name_idx").on(t.userId, t.name)],
);
