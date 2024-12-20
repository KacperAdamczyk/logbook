import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const pilots = sqliteTable("pilots", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => users.id),
	name: text().notNull(),
});

export const pilotsRelations = relations(pilots, ({ one, many }) => ({
	user: one(users, {
		fields: [pilots.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));

export type Pilot = typeof pilots.$inferSelect;
export type CreatePilot = typeof pilots.$inferInsert;
