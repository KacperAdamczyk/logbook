import { user } from '$lib/server/db/schema/auth';
import { flightLog } from '$lib/server/db/schema/flight-log';
import { commonFields } from '$lib/server/db/helpers';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const aircraft = sqliteTable('aircraft', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	model: text().notNull(),
	registration: text().notNull()
});

export const aircraftRelations = relations(aircraft, ({ one, many }) => ({
	user: one(user, {
		fields: [aircraft.userId],
		references: [user.id]
	}),
	flightLogs: many(flightLog)
}));
