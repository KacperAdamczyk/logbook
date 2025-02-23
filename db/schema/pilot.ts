import { user } from "@/db/schema/auth";
import { log } from "@/db/schema/log";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const pilot = sqliteTable("pilot", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull(),
});

export const pilotRelations = relations(pilot, ({ one, many }) => ({
	user: one(user, {
		fields: [pilot.userId],
		references: [user.id],
	}),
	logs: many(log),
}));

export type Pilot = typeof pilot.$inferSelect;
export type CreatePilot = typeof pilot.$inferInsert;
