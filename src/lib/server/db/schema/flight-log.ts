import { aircraft } from '$lib/server/db/schema/aircraft';
import { user } from '$lib/server/db/schema/auth';
import { commonFields } from '$lib/server/db/helpers';
import { pilot } from '$lib/server/db/schema/pilot';
import { place } from '$lib/server/db/schema/place';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const flightLog = sqliteTable('flight_log', {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	// Place
	departureAt: integer({ mode: 'timestamp_ms' }).notNull(),
	arrivalAt: integer({ mode: 'timestamp_ms' }).notNull(),
	departurePlaceId: text()
		.notNull()
		.references(() => place.id),
	arrivalPlaceId: text()
		.notNull()
		.references(() => place.id),
	// Aircraft and Pilot
	aircraftId: text()
		.notNull()
		.references(() => aircraft.id),
	pilotInCommandId: text()
		.notNull()
		.references(() => pilot.id),
	// Flight time details
	totalFlight: integer().notNull().default(0),
	singlePilotSingleEngine: integer().notNull().default(0),
	singlePilotMultiEngine: integer().notNull().default(0),
	multiPilot: integer().notNull().default(0),
	operationalConditionNight: integer().notNull().default(0),
	operationalConditionIfr: integer().notNull().default(0),
	functionPilotInCommand: integer().notNull().default(0),
	functionCoPilot: integer().notNull().default(0),
	functionDual: integer().notNull().default(0),
	functionInstructor: integer().notNull().default(0),
	// Additional details
	takeoffsDay: integer(),
	takeoffsNight: integer(),
	landingsDay: integer(),
	landingsNight: integer(),
	remarks: text()
});

export const flightLogRelations = relations(flightLog, ({ one }) => ({
	user: one(user, {
		fields: [flightLog.userId],
		references: [user.id]
	}),
	departurePlace: one(place, {
		fields: [flightLog.departurePlaceId],
		references: [place.id],
		relationName: 'departure_place'
	}),
	arrivalPlace: one(place, {
		fields: [flightLog.arrivalPlaceId],
		references: [place.id],
		relationName: 'arrival_place'
	}),
	aircraft: one(aircraft, {
		fields: [flightLog.aircraftId],
		references: [aircraft.id]
	}),
	pilotInCommand: one(pilot, {
		fields: [flightLog.pilotInCommandId],
		references: [pilot.id]
	})
}));
