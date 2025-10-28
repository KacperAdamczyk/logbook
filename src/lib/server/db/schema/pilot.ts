import { user } from './auth';
import { flightLog } from './flight-log';
import { commonFields } from '../helpers';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pilot = sqliteTable('pilot', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull()
});

export const pilotRelations = relations(pilot, ({ one, many }) => ({
	user: one(user, {
		fields: [pilot.userId],
		references: [user.id]
	}),
	flightLogs: many(flightLog)
}));
