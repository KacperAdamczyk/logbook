import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const aircraft = sqliteTable("aircraft", {
	id: text("id").primaryKey().$defaultFn(v7),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	model: text("model").notNull(),
	registration: text("registration").notNull(),
});

export const aircraftRelations = relations(aircraft, ({ one, many }) => ({
	user: one(users, {
		fields: [aircraft.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));

export type Aircraft = typeof aircraft.$inferSelect;
export type CreateAircraft = typeof aircraft.$inferInsert;
