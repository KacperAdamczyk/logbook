import { user } from "@/db/schema/auth";
import { log } from "@/db/schema/log";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const aircraft = sqliteTable("aircraft", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => user.id),
	model: text().notNull(),
	registration: text().notNull(),
});

export const aircraftRelations = relations(aircraft, ({ one, many }) => ({
	user: one(user, {
		fields: [aircraft.userId],
		references: [user.id],
	}),
	logs: many(log),
}));

export type Aircraft = typeof aircraft.$inferSelect;
export type CreateAircraft = typeof aircraft.$inferInsert;
