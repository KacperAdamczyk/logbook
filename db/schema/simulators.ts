import { users } from "@/db/schema/auth";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const simulators = sqliteTable("simulators", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => users.id),
});

export const simulatorsRelations = relations(simulators, ({ one }) => ({
	user: one(users, {
		fields: [simulators.userId],
		references: [users.id],
	}),
}));
