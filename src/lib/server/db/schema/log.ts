import { sqliteView } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { flightLog } from "./flight-log";
import { simulatorLog } from "./simulator-log";

const decodeTimestampMs = (value: unknown): Date => new Date(Number(value));
const decodeNullableTimestampMs = (value: unknown): Date | null => {
	if (value === null || value === undefined) {
		return null;
	}

	return decodeTimestampMs(value);
};

export const log = sqliteView("log").as((qb) =>
	qb
		.select({
			id: flightLog.id,
			type: sql<"flight" | "simulator">`'flight'`.as("type"),
			userId: flightLog.userId,
			// Views/select SQL expressions don't automatically reuse timestamp decoders from table columns.
			// mapWith keeps these fields as Date values, same as querying base tables directly.
			date: sql<Date>`${flightLog.departureAt}`.mapWith(decodeTimestampMs).as("date"),
			createdAt: flightLog.createdAt,
			updatedAt: flightLog.updatedAt,
			// Flight-specific: times
			departureAt: sql<Date | null>`${flightLog.departureAt}`
				.mapWith(decodeNullableTimestampMs)
				.as("departureAt"),
			arrivalAt: sql<Date | null>`${flightLog.arrivalAt}`
				.mapWith(decodeNullableTimestampMs)
				.as("arrivalAt"),
			// Flight-specific: foreign keys
			departurePlaceId: sql<string | null>`${flightLog.departurePlaceId}`.as("departurePlaceId"),
			arrivalPlaceId: sql<string | null>`${flightLog.arrivalPlaceId}`.as("arrivalPlaceId"),
			aircraftId: sql<string | null>`${flightLog.aircraftId}`.as("aircraftId"),
			pilotInCommandId: sql<string | null>`${flightLog.pilotInCommandId}`.as("pilotInCommandId"),
			// Flight-specific: flight times
			totalFlightTime: sql<number | null>`${flightLog.totalFlightTime}`.as("totalFlightTime"),
			singlePilotSingleEngineTime: sql<number | null>`${flightLog.singlePilotSingleEngineTime}`.as(
				"singlePilotSingleEngineTime",
			),
			singlePilotMultiEngineTime: sql<number | null>`${flightLog.singlePilotMultiEngineTime}`.as(
				"singlePilotMultiEngineTime",
			),
			multiPilotTime: sql<number | null>`${flightLog.multiPilotTime}`.as("multiPilotTime"),
			operationalConditionNightTime: sql<
				number | null
			>`${flightLog.operationalConditionNightTime}`.as("operationalConditionNightTime"),
			operationalConditionIfrTime: sql<number | null>`${flightLog.operationalConditionIfrTime}`.as(
				"operationalConditionIfrTime",
			),
			functionPilotInCommandTime: sql<number | null>`${flightLog.functionPilotInCommandTime}`.as(
				"functionPilotInCommandTime",
			),
			functionCoPilotTime: sql<number | null>`${flightLog.functionCoPilotTime}`.as(
				"functionCoPilotTime",
			),
			functionDualTime: sql<number | null>`${flightLog.functionDualTime}`.as("functionDualTime"),
			functionInstructorTime: sql<number | null>`${flightLog.functionInstructorTime}`.as(
				"functionInstructorTime",
			),
			// Flight-specific: takeoffs and landings
			takeoffsDay: sql<number | null>`${flightLog.takeoffsDay}`.as("takeoffsDay"),
			takeoffsNight: sql<number | null>`${flightLog.takeoffsNight}`.as("takeoffsNight"),
			landingsDay: sql<number | null>`${flightLog.landingsDay}`.as("landingsDay"),
			landingsNight: sql<number | null>`${flightLog.landingsNight}`.as("landingsNight"),
			// Flight-specific: remarks
			remarks: sql<string>`${flightLog.remarks}`.as("remarks"),
			// Simulator-specific (NULL for flights)
			simulatorType: sql<string | null>`NULL`.as("simulatorType"),
			simulatorTotalTime: sql<number | null>`NULL`.as("simulatorTotalTime"),
		})
		.from(flightLog)
		.unionAll(
			qb
				.select({
					id: simulatorLog.id,
					type: sql<"flight" | "simulator">`'simulator'`.as("type"),
					userId: simulatorLog.userId,
					date: sql<Date>`${simulatorLog.date}`.mapWith(decodeTimestampMs).as("date"),
					createdAt: simulatorLog.createdAt,
					updatedAt: simulatorLog.updatedAt,
					// Flight-specific: times (NULL for simulator)
					departureAt: sql<Date | null>`NULL`
						.mapWith(decodeNullableTimestampMs)
						.as("departureAt"),
					arrivalAt: sql<Date | null>`NULL`
						.mapWith(decodeNullableTimestampMs)
						.as("arrivalAt"),
					// Flight-specific: foreign keys (NULL for simulator)
					departurePlaceId: sql<string | null>`NULL`.as("departurePlaceId"),
					arrivalPlaceId: sql<string | null>`NULL`.as("arrivalPlaceId"),
					aircraftId: sql<string | null>`NULL`.as("aircraftId"),
					pilotInCommandId: sql<string | null>`NULL`.as("pilotInCommandId"),
					// Flight-specific: flight times (NULL for simulator)
					totalFlightTime: sql<number | null>`NULL`.as("totalFlightTime"),
					singlePilotSingleEngineTime: sql<number | null>`NULL`.as("singlePilotSingleEngineTime"),
					singlePilotMultiEngineTime: sql<number | null>`NULL`.as("singlePilotMultiEngineTime"),
					multiPilotTime: sql<number | null>`NULL`.as("multiPilotTime"),
					operationalConditionNightTime: sql<number | null>`NULL`.as(
						"operationalConditionNightTime",
					),
					operationalConditionIfrTime: sql<number | null>`NULL`.as("operationalConditionIfrTime"),
					functionPilotInCommandTime: sql<number | null>`NULL`.as("functionPilotInCommandTime"),
					functionCoPilotTime: sql<number | null>`NULL`.as("functionCoPilotTime"),
					functionDualTime: sql<number | null>`NULL`.as("functionDualTime"),
					functionInstructorTime: sql<number | null>`NULL`.as("functionInstructorTime"),
					// Flight-specific: takeoffs and landings (NULL for simulator)
					takeoffsDay: sql<number | null>`NULL`.as("takeoffsDay"),
					takeoffsNight: sql<number | null>`NULL`.as("takeoffsNight"),
					landingsDay: sql<number | null>`NULL`.as("landingsDay"),
					landingsNight: sql<number | null>`NULL`.as("landingsNight"),
					// Shared: remarks (mapped from simulatorLog for simulator entries)
					remarks: sql<string>`${simulatorLog.remarks}`.as("remarks"),
					// Simulator-specific
					simulatorType: sql<string | null>`${simulatorLog.type}`.as("simulatorType"),
					simulatorTotalTime: sql<number | null>`${simulatorLog.totalTime}`.as(
						"simulatorTotalTime",
					),
				})
				.from(simulatorLog),
		),
);
