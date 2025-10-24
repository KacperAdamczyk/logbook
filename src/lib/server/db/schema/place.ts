import { user } from '$lib/server/db/schema/auth';
import { flightLog } from '$lib/server/db/schema/flightLog';
import { commonFields } from '$lib/server/db/helpers';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const place = sqliteTable('place', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	name: text().notNull()
});

export const placeRelations = relations(place, ({ one, many }) => ({
	user: one(user, {
		fields: [place.userId],
		references: [user.id]
	}),
	flightLogs: many(flightLog)
}));
