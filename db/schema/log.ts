import { aircraft } from "@/db/schema/aircraft";
import { user } from "@/db/schema/auth";
import { pilot } from "@/db/schema/pilot";
import { place } from "@/db/schema/place";
import { time } from "@/db/schema/time";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const log = sqliteTable("log", {
	id: text().primaryKey().$defaultFn(v7),
	userId: text()
		.notNull()
		.references(() => user.id),
	departureAt: integer({ mode: "timestamp_ms" }).notNull(),
	arrivalAt: integer({ mode: "timestamp_ms" }).notNull(),
	departurePlaceId: text()
		.notNull()
		.references(() => place.id),
	arrivalPlaceId: text()
		.notNull()
		.references(() => place.id),
	aircraftId: text()
		.notNull()
		.references(() => aircraft.id),
	pilotInCommandId: text()
		.notNull()
		.references(() => pilot.id),
	takeoffsDay: integer(),
	takeoffsNight: integer(),
	landingsDay: integer(),
	landingsNight: integer(),
	singularTimesId: text()
		.notNull()
		.references(() => time.id),
	cumulatedTimesId: text()
		.notNull()
		.references(() => time.id),
	remarks: text(),
});

export const logRelations = relations(log, ({ one }) => ({
	user: one(user, {
		fields: [log.userId],
		references: [user.id],
	}),
	departurePlace: one(place, {
		fields: [log.departurePlaceId],
		references: [place.id],
		relationName: "departure_place",
	}),
	arrivalPlace: one(place, {
		fields: [log.arrivalPlaceId],
		references: [place.id],
		relationName: "arrival_place",
	}),
	aircraft: one(aircraft, {
		fields: [log.aircraftId],
		references: [aircraft.id],
	}),
	pilotInCommand: one(pilot, {
		fields: [log.pilotInCommandId],
		references: [pilot.id],
		relationName: "pilot_in_command",
	}),
	singularTimes: one(time, {
		fields: [log.singularTimesId],
		references: [time.id],
		relationName: "singular_times",
	}),
	cumulatedTimes: one(time, {
		fields: [log.cumulatedTimesId],
		references: [time.id],
		relationName: "cumulated_times",
	}),
}));

export type CreateLog = typeof log.$inferInsert;
export type Log = typeof log.$inferSelect;
