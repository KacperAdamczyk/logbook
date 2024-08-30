import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const times = sqliteTable("times", {
	id: text("id").primaryKey().$defaultFn(v7),
	totalFlight: integer("total_flight").notNull(),
	singlePilotSingleEngine: integer("single_pilot_single_engine"),
	singlePilotMultiEngine: integer("single_pilot_multi_engine"),
	multiPilot: integer("multi_pilot"),
	operationalConditionNight: integer(
		"operational_condition_night",
	),
	operationalConditionIfr: integer("operational_condition_ifr"),
	functionPilotInCommand: integer("function_pilot_in_command"),
	functionCoPilot: integer("function_co_pilot"),
	functionDual: integer("function_dual"),
	functionInstructor: integer("function_instructor"),
});
