import { users } from "@/db/schema/auth";
import { logs } from "@/db/schema/logs";
import { relations } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const places = sqliteTable("places", (t) => ({
	id: t.text().primaryKey().$defaultFn(v7),
	userId: t
		.text()
		.notNull()
		.references(() => users.id),
	name: t.text().notNull(),
}));

export const placesRelations = relations(places, ({ one, many }) => ({
	user: one(users, {
		fields: [places.userId],
		references: [users.id],
	}),
	logs: many(logs),
}));

export type Place = typeof places.$inferSelect;
export type CreatePlace = typeof places.$inferInsert;
