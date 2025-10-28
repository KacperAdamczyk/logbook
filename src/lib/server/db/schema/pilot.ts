import { user } from '$lib/server/db/schema/auth';
import { flightLog } from '$lib/server/db/schema/flight-log';
import { commonFields } from '$lib/server/db/helpers';
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
