import { user } from "@/db/schema/auth"; // was users
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const simulator = sqliteTable("simulator", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => user.id), // update reference
});

export const simulatorRelations = relations(simulator, ({ one }) => ({
	user: one(user, {
		fields: [simulator.userId],
		references: [user.id],
	}),
}));
