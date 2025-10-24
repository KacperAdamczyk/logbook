import { user } from '$lib/server/db/schema/auth';
import { commonFields } from '$lib/server/db/helpers';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const simulatorLog = sqliteTable('simulatorLog', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id)
});

export const simulatorLogRelations = relations(simulatorLog, ({ one }) => ({
	user: one(user, {
		fields: [simulatorLog.userId],
		references: [user.id]
	})
}));
