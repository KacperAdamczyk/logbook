import { user } from "@/db/schema/auth";
import { log } from "@/db/schema/log";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const place = sqliteTable("place", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull(),
});

export const placeRelations = relations(place, ({ one, many }) => ({
	user: one(user, {
		fields: [place.userId],
		references: [user.id],
	}),
	logs: many(log),
}));

export type Place = typeof place.$inferSelect;
export type CreatePlace = typeof place.$inferInsert;
