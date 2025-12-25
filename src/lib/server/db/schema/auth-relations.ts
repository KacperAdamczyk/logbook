import { relations } from "drizzle-orm";
import { user } from "./auth";
import { flightLog } from "./flight-log";
import { simulatorLog } from "./simulator-log";

export const userRelations = relations(user, ({ many }) => ({
	flightLogs: many(flightLog),
	simulatorLogs: many(simulatorLog),
}));
