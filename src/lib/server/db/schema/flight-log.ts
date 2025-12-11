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
	totalFlightTime: integer().notNull(),
	singlePilotType: text({ enum: ['single', 'multi'] }),
	singlePilotTime: integer().notNull(),
	multiPilotTime: integer().notNull(),
	operationalConditionNightTime: integer().notNull(),
	operationalConditionIfrTime: integer().notNull(),
	functionPilotInCommandTime: integer().notNull(),
	functionCoPilotTime: integer().notNull(),
	functionDualTime: integer().notNull(),
	functionInstructorTime: integer().notNull(),
	// Additional details
	takeoffsDay: integer(),
	takeoffsNight: integer(),
	landingsDay: integer(),
	landingsNight: integer(),
	remarks: text()
});
