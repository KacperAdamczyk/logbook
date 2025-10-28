import { user } from './auth';
import { commonFields } from '../helpers';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const simulatorLog = sqliteTable('simulator_log', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	date: integer({ mode: 'timestamp_ms' }).notNull()
});

export const simulatorLogRelations = relations(simulatorLog, ({ one }) => ({
	user: one(user, {
		fields: [simulatorLog.userId],
		references: [user.id]
	})
}));
