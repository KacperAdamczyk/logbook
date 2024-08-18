import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const pilots = sqliteTable("pilots", {
	id: text("id").primaryKey().$defaultFn(v7),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	name: text("name").notNull(),
});

export const pilotsRelations = relations(pilots, ({ one, many }) => ({
	user: one(users, {
		fields: [pilots.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));
