import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const time = sqliteTable("time", {
	id: text().primaryKey().$defaultFn(v7),
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
});

export type Time = typeof time.$inferSelect;
export type CreateTime = typeof time.$inferInsert;
