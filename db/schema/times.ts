import { sqliteTable } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const times = sqliteTable("times", (t) => ({
	id: t.text().primaryKey().$defaultFn(v7),
	totalFlight: t.integer().notNull().default(0),
	singlePilotSingleEngine: t.integer().notNull().default(0),
	singlePilotMultiEngine: t.integer().notNull().default(0),
	multiPilot: t.integer().notNull().default(0),
	operationalConditionNight: t.integer().notNull().default(0),
	operationalConditionIfr: t.integer().notNull().default(0),
	functionPilotInCommand: t.integer().notNull().default(0),
	functionCoPilot: t.integer().notNull().default(0),
	functionDual: t.integer().notNull().default(0),
	functionInstructor: t.integer().notNull().default(0),
}));

export type Time = typeof times.$inferSelect;
export type CreateTime = typeof times.$inferInsert;
