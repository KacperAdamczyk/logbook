import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const pilot = sqliteTable(
	"pilot",
	{
		...commonFields,
		userId: text()
			.notNull()
			.references(() => user.id),
		name: text().notNull(),
	},
	(t) => [unique().on(t.userId, t.name)],
);
