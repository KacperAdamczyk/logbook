import type { FlightLogSchemaOutput } from "$lib/remotes/flight-log/flight-log.schema";
import { createDbAction } from "$lib/server/db/actions/createDbAction";
import { findOverlappingLogs } from "$lib/server/db/actions/find-overlapping-logs";
import { getOrCreateAircraft } from "$lib/server/db/actions/get-or-create-aircraft";
import { getOrCreatePilot } from "$lib/server/db/actions/get-or-create-pilot";
import { getOrCreatePlace } from "$lib/server/db/actions/get-or-create-place";
import { flightLog } from "$lib/server/db/schema";
import { Temporal } from "@js-temporal/polyfill";
import { DrizzleError } from "drizzle-orm";
import { parseTime } from "$lib/utils/parse-time";

export const createFlightLog = createDbAction(
	async (
		db,
		userId: string,
		{
			date,
			departurePlace: departurePlaceName,
			departureTime,
			arrivalPlace: arrivalPlaceName,
			arrivalTime,
			aircraftRegistration,
			aircraftModel,
			pilotInCommandName,
			totalFlightTime,
			singlePilotSingleEngineTime,
			singlePilotMultiEngineTime,
			multiPilotTime,
			functionCoPilotTime,
			functionDualTime,
			functionInstructorTime,
			functionPilotInCommandTime,
			operationalConditionIfrTime,
			operationalConditionNightTime,
			landingsDay = 0,
			landingsNight = 0,
			takeoffsDay = 0,
			takeoffsNight = 0,
			remarks = "",
		}: FlightLogSchemaOutput,
	) => {
		try {
			return db.transaction(async (tx) => {
				const departureDate = Temporal.PlainDateTime.from(date).withPlainTime(
					parseTime(departureTime),
				);
				const arrivalDate = Temporal.PlainDateTime.from(date).withPlainTime(parseTime(arrivalTime));

				const overlappingLogs = await findOverlappingLogs(tx, {
					userId,
					departureAt: departureDate,
					arrivalAt: arrivalDate,
				});

				if (overlappingLogs.length > 0) throw new Error("Flight log overlaps with existing logs");

				const [departurePlace, arrivalPlace, aircraft, pilotInCommand] = await Promise.all([
					getOrCreatePlace(tx, userId, departurePlaceName.toLocaleUpperCase()),
					getOrCreatePlace(tx, userId, arrivalPlaceName.toLocaleUpperCase()),
					getOrCreateAircraft(
						tx,
						userId,
						aircraftRegistration.toLocaleUpperCase(),
						aircraftModel.toLocaleUpperCase(),
					),
					getOrCreatePilot(tx, userId, pilotInCommandName.toLocaleUpperCase()),
				]);

				const [newFlightLog] = await tx
					.insert(flightLog)
					.values({
						userId,
						departureAt: new Date(departureDate.toString()),
						arrivalAt: new Date(arrivalDate.toString()),
						departurePlaceId: departurePlace.id,
						arrivalPlaceId: arrivalPlace.id,
						aircraftId: aircraft.id,
						pilotInCommandId: pilotInCommand.id,
						totalFlightTime: totalFlightTime.total("minutes"),
						singlePilotSingleEngineTime: singlePilotSingleEngineTime.total("minutes"),
						singlePilotMultiEngineTime: singlePilotMultiEngineTime.total("minutes"),
						multiPilotTime: multiPilotTime.total("minutes"),
						functionCoPilotTime: functionCoPilotTime.total("minutes"),
						functionDualTime: functionDualTime.total("minutes"),
						functionInstructorTime: functionInstructorTime.total("minutes"),
						functionPilotInCommandTime: functionPilotInCommandTime.total("minutes"),
						operationalConditionIfrTime: operationalConditionIfrTime.total("minutes"),
						operationalConditionNightTime: operationalConditionNightTime.total("minutes"),
						landingsDay: landingsDay,
						landingsNight: landingsNight,
						takeoffsDay: takeoffsDay,
						takeoffsNight: takeoffsNight,
						remarks: remarks,
					})
					.returning();

				return newFlightLog;
			});
		} catch (error) {
			console.error("Error creating flight log:", error);
			if (error instanceof DrizzleError) {
				console.error("DrizzleError creating flight log:", error.message, error.cause);
			}

			throw error;
		}
	},
);
