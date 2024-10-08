import { aircraft } from "@/db/schema/aircraft";
import { users } from "@/db/schema/auth";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { times } from "@/db/schema/times";
import { relations } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export const logs = sqliteTable("logs", (t) => ({
	id: t.text().primaryKey().$defaultFn(v7),
	userId: t
		.text()
		.notNull()
		.references(() => users.id),
	departureAt: t.integer({ mode: "timestamp_ms" }).notNull(),
	arrivalAt: t.integer({ mode: "timestamp_ms" }).notNull(),
	departurePlaceId: t
		.text()
		.notNull()
		.references(() => places.id),
	arrivalPlaceId: t
		.text()
		.notNull()
		.references(() => places.id),
	aircraftId: t
		.text()
		.notNull()
		.references(() => aircraft.id),
	pilotInCommandId: t
		.text()
		.notNull()
		.references(() => pilots.id),
	takeoffsDay: t.integer(),
	takeoffsNight: t.integer(),
	landingsDay: t.integer(),
	landingsNight: t.integer(),
	singularTimesId: t
		.text()
		.notNull()
		.references(() => times.id),
	cumulatedTimesId: t
		.text()
		.notNull()
		.references(() => times.id),
	remarks: t.text(),
}));

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
