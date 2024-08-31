"use server";

import { actionClient } from "@/actions/safe-action";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { db } from "@/db";
import { getOrCreateAircraft } from "@/db/actions/getOrCreateAircraft";
import { getOrCreatePilot } from "@/db/actions/getOrCreatePilot";
import { getOrCreatePlace } from "@/db/actions/getOrCreatePlace";
import { recalculateLogs } from "@/db/actions/recalculateLogs";
import { getOverlappingLogs } from "@/db/queries/getOverlappingLogs";
import { logs, times } from "@/db/schema";
import { formatToMinutes } from "@/helpers/formatToMinutes";
import { getFlightDates } from "@/helpers/getFlightDates";
import { getParsedTimes } from "@/helpers/getParsedTimes";
import { returnValidationErrors } from "next-safe-action";

export const createLogAction = actionClient
	.schema(logFormSchema)
	.action(async ({ parsedInput, ctx: { userId } }) =>
		db.transaction(async (tx) => {
			const [departure, arrival] = getFlightDates(
				parsedInput.date,
				parsedInput.departureTime,
				parsedInput.arrivalTime,
			);

			const overlappingLogs = await getOverlappingLogs(
				{ departure, arrival },
				tx,
			);

			if (overlappingLogs.length) {
				returnValidationErrors(logFormSchema, {
					date: { _errors: ["This log overlaps with an existing log"] },
				});
			}

			const arrivalPlace = await getOrCreatePlace(
				{
					userId,
					name: parsedInput.arrivalPlace,
				},
				tx,
			);
			const departurePlace = await getOrCreatePlace(
				{
					userId,
					name: parsedInput.departurePlace,
				},
				tx,
			);
			const aircraft = await getOrCreateAircraft(
				{
					userId,
					model: parsedInput.planeModel,
					registration: parsedInput.planeRegistration,
				},
				tx,
			);
			const pilot = await getOrCreatePilot(
				{ userId, name: parsedInput.pilotInCommand },
				tx,
			);

			const [singularTimes, cumulatedTimes] = await tx
				.insert(times)
				.values([getParsedTimes(parsedInput), {}])
				.returning();

			const [log] = await tx
				.insert(logs)
				.values({
					userId,
					departureAt: departure,
					arrivalAt: arrival,
					departurePlaceId: departurePlace.id,
					arrivalPlaceId: arrivalPlace.id,
					aircraftId: aircraft.id,
					pilotInCommandId: pilot.id,
					takeoffsDay: parsedInput.takeoffsDay,
					takeoffsNight: parsedInput.takeoffsNight,
					landingsDay: parsedInput.landingsDay,
					landingsNight: parsedInput.landingsNight,
					remarks: parsedInput.remarks,
					singularTimesId: singularTimes.id,
					cumulatedTimesId: cumulatedTimes.id,
				})
				.returning();

			const updatedTimes = await recalculateLogs(
				{ userId, since: log.departureAt },
				tx,
			);

			return { log, updatedTimes };
		}),
	);
