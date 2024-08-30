import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const places = sqliteTable("places", {
	id: text("id").primaryKey().$defaultFn(v7),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	name: text("name").notNull(),
});

export const placesRelations = relations(places, ({ one, many }) => ({
	user: one(users, {
		fields: [places.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));

export type Place = typeof places.$inferSelect;
export type CreatePlace = typeof places.$inferInsert;