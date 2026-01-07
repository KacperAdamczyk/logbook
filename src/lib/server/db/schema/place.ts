import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const place = sqliteTable(
	"place",
	{
		...commonFields,
		userId: text()
			.notNull()
			.references(() => user.id),
		name: text().notNull(),
	},
	(t) => [unique().on(t.userId, t.name)]
);
