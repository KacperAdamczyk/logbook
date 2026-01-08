import { user } from "./auth";
import { commonFields } from "../helpers";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const aircraft = sqliteTable(
	"aircraft",
	{
		...commonFields,
		userId: text()
			.notNull()
			.references(() => user.id),
		model: text().notNull(),
		registration: text().notNull(),
	},
	(t) => [uniqueIndex("aircraft_user_registration_idx").on(t.userId, t.registration)],
);
