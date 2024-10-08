import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const aircraft = sqliteTable("aircraft", (t) => ({
	id: t.text().primaryKey().$defaultFn(v7),
	userId: t
		.text()
		.notNull()
		.references(() => users.id),
	model: t.text().notNull(),
	registration: t.text().notNull(),
}));

export const aircraftRelations = relations(aircraft, ({ one, many }) => ({
	user: one(users, {
		fields: [aircraft.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));

export type Aircraft = typeof aircraft.$inferSelect;
export type CreateAircraft = typeof aircraft.$inferInsert;
