import { aircraft } from "@/db/schema/aircraft";
import { users } from "@/db/schema/auth";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { times } from "@/db/schema/times";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const logs = sqliteTable("logs", {
	id: text("id").primaryKey().$defaultFn(v7),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	departureAt: integer("departure_at", { mode: "timestamp_ms" }).notNull(),
	arrivalAt: integer("arrival_at", { mode: "timestamp_ms" }).notNull(),
	departurePlaceId: text("departure_place_id")
		.notNull()
		.references(() => places.id),
	arrivalPlaceId: text("arrival_place_id")
		.notNull()
		.references(() => places.id),
	aircraftId: text("aircraft_id")
		.notNull()
		.references(() => aircraft.id),
	pilotInCommandId: text("pilot_in_command_id")
		.notNull()
		.references(() => pilots.id),
	takeoffsDay: integer("takeoffs_day"),
	takeoffsNight: integer("takeoffs_night"),
	landingsDay: integer("landings_day"),
	landingsNight: integer("landings_night"),
	singularTimesId: text("singular_times_id")
		.notNull()
		.references(() => times.id),
	cumulatedTimesId: text("cumulated_times_id")
		.notNull()
		.references(() => times.id),
	remarks: text("remarks"),
});

export const logsRelations = relations(logs, ({ one }) => ({
	user: one(users, {
		fields: [logs.userId],
		references: [users.id],
	}),
	departurePlace: one(places, {
		fields: [logs.departurePlaceId],
		references: [places.id],
		relationName: "departure_place",
	}),
	arrivalPlace: one(places, {
		fields: [logs.arrivalPlaceId],
		references: [places.id],
		relationName: "arrival_place",
	}),
	aircraft: one(aircraft, {
		fields: [logs.aircraftId],
		references: [aircraft.id],
	}),
	pilotInCommand: one(pilots, {
		fields: [logs.pilotInCommandId],
		references: [pilots.id],
		relationName: "pilot_in_command",
	}),
	singularTimes: one(times, {
		fields: [logs.singularTimesId],
		references: [times.id],
		relationName: "singular_times",
	}),
	cumulatedTimes: one(times, {
		fields: [logs.cumulatedTimesId],
		references: [times.id],
		relationName: "cumulated_times",
	}),
}));

export type CreateLog = typeof logs.$inferInsert;
export type Log = typeof logs.$inferSelect;
