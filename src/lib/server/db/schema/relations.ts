import { defineRelations } from "drizzle-orm";
import * as schema from "./index";

export const relations = defineRelations(schema, (r) => ({
	user: {
		flightLogs: r.many.flightLog({
			from: r.user.id,
			to: r.flightLog.userId,
		}),
		simulatorLogs: r.many.simulatorLog({
			from: r.user.id,
			to: r.simulatorLog.userId,
		}),
		pilots: r.many.pilot({
			from: r.user.id,
			to: r.pilot.userId,
		}),
		aircraft: r.many.aircraft({
			from: r.user.id,
			to: r.aircraft.userId,
		}),
		places: r.many.place({
			from: r.user.id,
			to: r.place.userId,
		}),
	},
	flightLog: {
		user: r.one.user({
			from: r.flightLog.userId,
			to: r.user.id,
		}),
		departurePlace: r.one.place({
			from: r.flightLog.departurePlaceId,
			to: r.place.id,
			alias: "departure_place",
		}),
		arrivalPlace: r.one.place({
			from: r.flightLog.arrivalPlaceId,
			to: r.place.id,
			alias: "arrival_place",
		}),
		aircraft: r.one.aircraft({
			from: r.flightLog.aircraftId,
			to: r.aircraft.id,
		}),
		pilotInCommand: r.one.pilot({
			from: r.flightLog.pilotInCommandId,
			to: r.pilot.id,
		}),
	},
	simulatorLog: {
		user: r.one.user({
			from: r.simulatorLog.userId,
			to: r.user.id,
		}),
	},
	pilot: {
		user: r.one.user({
			from: r.pilot.userId,
			to: r.user.id,
		}),
		flightLogs: r.many.flightLog({
			from: r.pilot.id,
			to: r.flightLog.pilotInCommandId,
		}),
	},
	aircraft: {
		user: r.one.user({
			from: r.aircraft.userId,
			to: r.user.id,
		}),
		flightLogs: r.many.flightLog({
			from: r.aircraft.id,
			to: r.flightLog.aircraftId,
		}),
	},
	place: {
		user: r.one.user({
			from: r.place.userId,
			to: r.user.id,
		}),
		departureFlightLogs: r.many.flightLog({
			from: r.place.id,
			to: r.flightLog.departurePlaceId,
			alias: "departure_flight_log",
		}),
		arrivalFlightLogs: r.many.flightLog({
			from: r.place.id,
			to: r.flightLog.arrivalPlaceId,
			alias: "arrival_flight_log",
		}),
	},
}));
