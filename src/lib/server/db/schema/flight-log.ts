import { aircraft } from './aircraft';
import { user } from './auth';
import { commonFields } from '../helpers';
import { pilot } from './pilot';
import { place } from './place';
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
