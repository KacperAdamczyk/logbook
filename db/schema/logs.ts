import { aircraft } from "@/db/schema/aircraft";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const logs = pgTable("log", {
	id: text("id").primaryKey().$defaultFn(v7),
	departureAt: timestamp("departure_at").notNull(),
	arrivalAt: timestamp("arrival_at").notNull(),
	departurePlace: text("departure_place")
		.notNull()
		.references(() => places.id),
	arrivalPlace: text("arrival_place")
		.notNull()
		.references(() => places.id),
	aircraft: text("aircraft")
		.notNull()
		.references(() => aircraft.id),
	pilotInCommand: text("pilot_in_command")
		.notNull()
		.references(() => pilots.id),
	singlePilotTimeSingleEngine: integer("single_pilot_time_single_engine"),
	singlePilotTimeMultiEngine: integer("single_pilot_time_multi_engine"),
	multiPilotTime: integer("multi_pilot_time"),
	totalFlightTime: integer("total_flight_time"),
	takeoffsDay: integer("takeoffs_day"),
	takeoffsNight: integer("takeoffs_night"),
	landingsDay: integer("landings_day"),
	landingsNight: integer("landings_night"),
	operationalConditionTimeNight: integer("operational_condition_time_night"),
	operationalConditionTimeIfr: integer("operational_condition_time_ifr"),
	functionTimePilotInCommand: integer("function_time_pilot_in_command"),
	functionTimeCoPilot: integer("function_time_co_pilot"),
	functionTimeDual: integer("function_time_dual"),
	functionTimeInstructor: integer("function_time_instructor"),
});
