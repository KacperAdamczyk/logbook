import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const times = sqliteTable("times", {
	id: text("id").primaryKey().$defaultFn(v7),
	totalFlight: integer("total_flight").notNull(),
	singlePilotSingleEngine: integer("single_pilot_single_engine")
		.notNull()
		.default(0),
	singlePilotMultiEngine: integer("single_pilot_multi_engine")
		.notNull()
		.default(0),
	multiPilot: integer("multi_pilot").notNull().default(0),
	operationalConditionNight: integer("operational_condition_night")
		.notNull()
		.default(0),
	operationalConditionIfr: integer("operational_condition_ifr")
		.notNull()
		.default(0),
	functionPilotInCommand: integer("function_pilot_in_command")
		.notNull()
		.default(0),
	functionCoPilot: integer("function_co_pilot").notNull().default(0),
	functionDual: integer("function_dual").notNull().default(0),
	functionInstructor: integer("function_instructor").notNull().default(0),
});

export type Time = typeof times.$inferSelect;
export type CreateTime = typeof times.$inferInsert;
