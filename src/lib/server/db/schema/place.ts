import { user } from './auth';
import { flightLog } from './flight-log';
import { commonFields } from '../helpers';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const place = sqliteTable('place', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull()
});

export const placeRelations = relations(place, ({ many }) => ({
	flightLogs: many(flightLog)
}));
